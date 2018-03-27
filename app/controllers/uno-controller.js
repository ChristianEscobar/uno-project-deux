"use strict"

const express = require("express");
const router = express.Router();
const db = require("../models");
const Values = db.Values;
const Colors = db.Colors;
const Cards = db.Cards;
const Deck = db.Deck;
const Users = db.Users;
const Discard = db.Discard;
const Hands = db.Hands;
const Enum = require("enum");
const Shuffle = require("shuffle");
const utilities = require("./utils/utilities");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// Loads the login page
/*
router.get("/", (req, res) => {
	res.redirect("/login.html");
});
*/

// Quick login
router.get("/", (req, res) => {
	res.redirect("/login-quick.html");
});

// Game Tester
router.get("/game-test", (req, res) => {
	res.redirect("/game-test.html");
});

// Sets up a new game
router.post("/game/start", (req, res) => {
	console.log(req.path);

	let colorValues = null;

	let populateCardsTable = false;

	let resultObj = {};

	let usersTable = null;

	let dealtCards = [];

	// Start by checking if enough players have joined the game
	Users.findAll()
	.then((users) => {
		if(users === null || users.length < 2) {
			throw new Error("Not enough players have joined");
		}

		usersTable = users;
		resultObj.users = users;

		// Check if the Cards table has to be populated
		return Cards.findAll();
	})
	.then((cardsTable) => {
		if(cardsTable === null || cardsTable.length === 0) {
			populateCardsTable = true;
		} else {
			populateCardsTable = false;
		}

		resultObj.cardsLength = cardsTable.length;
		resultObj.populateCards = populateCardsTable;

		// Remove rows from Deck table
		return Deck.destroy({
			where: {},  // We want all the rows gone!
			truncate: true
		});
	})
	.then((deckDestroy) => {
		resultObj.deckDestroy = deckDestroy;

		// Clear the Hands table
		return Hands.destroy({
			where: {},  // We want all the rows gone!
			truncate: true
		});
	})
	.then((handsDestroy) => {
		resultObj.handsDestroy = handsDestroy;

		// Pull data from Colors table
		return Colors.findAll();	
	})
	.then((colors) => {
		if(colors === null || colors.length === 0) {
			throw new Error("No rows found in Colors table.  Have you executed seeder script?");
		}
				
		colorValues = colors;

		// Pull data from the Values table
		return Values.findAll()
	})
	.then((values) => {
		if(values === null || values.length === 0) {
			throw new Error("No rows found in Values table.  Have you executed seeder script?");
		}

		// Now, populate the Cards table if necessary
		// For each color create cards as follows
		// 76x numbers (0-9, all colors)
		// 8x draw two (2x each color)
		// 8x reverse (2x each color)
		// 8x skip (2x each color)
		// 4x wild
		// 4x wild draw four
		if(populateCardsTable === true) {
			const createPromises = [];

			let wildsCreated = false;
			let wildsDrawFourCreated = false;

			// We are inserting a whole bunch of rows here, so we will store
			// each create promise and then return a Promise.all
			
			// The NO_COLOR value is reserved for WILD cards only.
			for(let i=0; i < colorValues.length; i++) {
				for(let j=0; j < values.length; j++) {
					let promise = null;
				
					if((Number(values[j].value) >= 1 && Number(values[j].value <= 12)) && colorValues[i].color != "NO_COLOR") {
						
						// Create 2 cards of 0 - 9 for each color

						// Create image name based on value
						let smallImageName = "";
						let largeImageName = "";

						switch(values[j].value) {
							case 10: {
								smallImageName = colorValues[i].color + "_picker.png";
								largeImageName = colorValues[i].color + "_picker_large.png";
								break;
							}
							case 11: {
								smallImageName = colorValues[i].color + "_reverse.png";
								largeImageName = colorValues[i].color + "_reverse_large.png";
								break;
							}
							case 12: {
								smallImageName = colorValues[i].color + "_skip.png";
								largeImageName = colorValues[i].color + "_skip_large.png";
								break;
							}
							default: {
								smallImageName = colorValues[i].color + "_" + values[j].value + ".png";
								largeImageName = colorValues[i].color + "_" + values[j].value + "_large.png";
							}
						}

						createPromises.push.apply(createPromises, utilities.createCards(2, smallImageName, largeImageName, values[j].id, colorValues[i].id));

					} else if((Number(values[j].value) === 13 && wildsCreated === false) && colorValues[i].color == "NO_COLOR") {
						
						// Create 4 cards each of WILD with no color designation
						const smallImageName = "wild_color_changer.png";
						const largeImageName = "wild_color_changer_large.png";

						createPromises.push.apply(createPromises, utilities.createCards(4, smallImageName, largeImageName, values[j].id, colorValues[i].id));

						wildsCreated = true;

					} else if((Number(values[j].value) === 14 && wildsDrawFourCreated === false) && colorValues[i].color == "NO_COLOR") {
						
						// Create 4 cards each of WILD with no color designation
						const smallImageName = "wild_pick_four.png";
						const largeImageName = "wild_pick_four_large.png";

						createPromises.push.apply(createPromises, utilities.createCards(4, smallImageName, largeImageName, values[j].id, colorValues[i].id));

						wildsDrawFourCreated = true;
					} 
					else if(Number(values[j].value) === 0 && colorValues[i].color != "NO_COLOR"){
						
						// Create 1 zero card per color
						const smallImageName = colorValues[i].color + "_" + values[j].value + ".png";
						const largeImageName = colorValues[i].color + "_" + values[j].value + "_large.png";

						createPromises.push.apply(createPromises, utilities.createCards(1, smallImageName, largeImageName, values[j].id, colorValues[i].id));
					
					} else {
						// Skip anything else
						continue;
					}
				}
			}
			return Promise.all(createPromises);
		} else {
			return Promise.resolve(true);
		}
	})
	.then((results) => {
		// Now, create a new shuffled deck
		return utilities.newShuffledDeck();
	})
	.then((results) => {
		resultObj.deck = results;

		// Deal 7 cards to each Player
		/*
		const dealPromises = [];

		for(let i=0; i<usersTable.length; i++) {
			let promise = utilities.dealCards(usersTable[i].id);
			dealPromises.push(promise);
		}

		return Promise.all(dealPromises);
		*/
		// This needs fixing, should be more dynamic using the commented out code above.
		// In the interest of time, it had to be done this way.
		return utilities.dealCards(1);
	})
	.then((results) => {
		dealtCards.push(results);

		return utilities.dealCards(2);
	})
	.then((results) => {
		dealtCards.push(results);

		resultObj.dealtCards = dealtCards;

		// Clear the Discards table
		return Discard.destroy({
			where: {},  // We want all the rows gone!
			truncate: true
		}); 
	})
	.then((resutls) => {

		// Draw one card from the top of the deck
		return utilities.drawCards(1, true);
	})
	.then((results) => {
		resultObj.topOfDiscard = results[0].cardId;

		// Place the card on the discard pile
		return utilities.addToDiscardPile(results[0].cardId);
	})
	.then((results) => {
		// Delete the top most card from the deck since it is now on the discard pile
		const cardIds = [];
		cardIds.push(results.cardId);

		return utilities.deleteFromDeck(cardIds);
	})
	.then((results) => {
		// Set player 1 as next player
		return utilities.setPlayerTurn(1, true);
	})
	.then((results) => {
		// Set player 2 turn to false
		return utilities.setPlayerTurn(2, false);
	})
	.then((results) => {
		res.status(200).json(resultObj);
	})
	.catch((error) => res.status(500).json( { error: utilities.createErrorMessageJSON("Error encountered while attempting to setup a new game.", error) } ) );
});

router.get("/game/player/:playerId", (req, res) => {
	console.log(req.path);

	return Users.findAll({
		where: {id: req.params.playerId}
	})
	.then((results) => {
		if(results === null || results.length === 0) {
			throw new Error("User not found");
		}

		res.status(200).json(results);
	})
	.catch((error) => res.status(500).json( { error : utilities.createErrorMessageJSON("Error encountered while extracting player details.", error) } ) );
});

router.post("/game/player", (req, res) => {
	console.log(req.path);

	let responseObj = {}

	Users.findAll()
	.then((results) => {
		// Check if user can be added
		if(results.length === 0) {
			return Users.create({
				id: 1,  // Lame hack to handle only two players.
				name: req.body.name,
				totalWins: 0,
				totalLosses: 0,
				isPlaying: true
			});
		} else if(results.length === 1) {
			// Continuing lame hack to handle only two players.
			const playerId = (results[0].id === 1) ? 2 : 1;

			return Users.create({
				id: playerId,
				name: req.body.name,
				totalWins: 0,
				totalLosses: 0,
				isPlaying: true
			});
		} else {
			responseObj.id = -1;
			responseObj.message = "Enough players have joined the game";

			return Promise.resolve(responseObj);
		}
	})
	.then((results) => {
		res.status(200).json(results);
	})
	.catch((error) => utilities.createErrorMessageJSON("Error encountered while creating new player.", error));
});


// Creates a new shuffled deck
router.post("/game/deck", (req, res) => {
	console.log(req.path);

	utilities.newShuffledDeck()
	.then((results) => {
		res.status(200).json(results);
	})
	.catch((error) => res.status(500).json( { error: utilities.createErrorMessageJSON("Error encountered while creating deck.",error) } ) );
});

// Adds one card to the player's hand
router.post("/game/draw", (req, res) => {
	console.log(req.path);

	let resultObj = {};
	resultObj.playerId = Number(req.body.playerId);

	// Start by checking if it is the player's turn
	utilities.isPlayerTurn(req.body.playerId)
	.then((user) => {
		if(user === null || user.length === 0) {
			throw new Error("No users found");
		}

		if(user[0].isTurn === false) {
			throw new Error("Not your turn yet");
		}

		// Now check if the user is pending a color choice
		return utilities.getPlayerColorPending(req.body.playerId);
	})
	.then((pending) => {
		if(pending.colorPending === true) {
			throw new Error("Player needs to choose color for discarded WILD card");
		}

		// Now check if the user has already drawn a card
		return utilities.getPlayerHasDrawn(req.body.playerId);
	})
	.then((drawn) => {
		if(drawn.userHasDrawn === true) {
			throw new Error("Player has already drawn a card");
		}

		// Draw one card
		return utilities.drawCards(1, false);
	})
	.then((card) => {
		// Add to response
		resultObj.card = card;

		// Add card to player's hand
		return utilities.addCardsToPlayerHand(req.body.playerId, card);
	})
	.then((results) => {
		// Set hasDrawn to true
		return utilities.setPlayerHasDrawn(req.body.playerId, true);
	})
	.then((results) => {
		res.status(200).json(resultObj);
	})
	.catch((error) => res.status(500).json( { error: utilities.createErrorMessageJSON("Error encountered while drawing card for player", error) } ) );

});

// Discards a card from the specified players hand and places on the discard pile
router.post("/game/discard", (req, res) => {
	console.log(req.path);

	let resultObj = {};

	// The Player that discarded
	resultObj.playerId = Number(req.body.playerId);

	let nextPlayerId = null;

	let matchedOnColorOrNumber = false;

	// Add logic to check if user who has discarded will not have anymore cards
	// That is a winner!

	// Start by getting the next player
	utilities.getNextPlayer()
	.then((results) => {
		if(results === null || results.length === 0) {
			throw new Error("Unable to determine the next Player.  Have enough players joined?");
		}

		nextPlayerId = results[0].id;

		// The next Player
		resultObj.nextPlayerId = nextPlayerId;

		// Check if it is this player's turn
		return utilities.isPlayerTurn(req.body.playerId)
	})
	.then((user) => {
		resultObj.isPlayerTurn = user[0].isTurn;

		if(user[0].isTurn === false) {
			throw new Error("Not your turn yet");
		}

		// Check if Player's color choice is pending
		return utilities.getPlayerColorPending(req.body.playerId);
	})
	.then((pending) => {
		if(pending.colorPending === true) {
			throw new Error("Player needs to choose color for discarded WILD card");
		}
	
		// Get Card object for discarded card
		return utilities.getCard(req.body.cardId);
	})
	.then((card) => {
		// Discarded card
		resultObj.discarded = card;

		// Check if the discarded card belongs to the User's hand
		return utilities.doesPlayerOwnCard(req.body.playerId, req.body.cardId)
		.then((count) => {
			if(count[0].dataValues.card_count === 0) {
				throw new Error("Player does not own specified cardId " + req.body.cardId);
			}
			else {
				return Promise.resolve(true);
			}
		});
	})
	.then((results) => {
		// Card on top of discard
		return utilities.topCardOnDiscard();
	})
	.then((results) => {
		return utilities.getCard(results[0].cardId);
	})
	.then((card) => {
		// Add card on top of discard to result
		resultObj.topOfDiscard = card;

		// Is the card being discarded a WILD or WILD DRAW FOUR
		return utilities.isWildCard(req.body.cardId);
	})
	.then((results) => {
		resultObj.isWild = results.isWildCard;
		resultObj.isWildDrawFour = results.isWildDrawFour;
		resultObj.needToChooseColor = false;

		// WILD cards will result in a response of needToChooseColor: true
		if(results.isWildCard === true || results.isWildDrawFour === true) {
			// The only difference in logic between these two cards, is that the DRAW FOUR 
			// will need to add 4 cards to the next Player's hand.

			resultObj.needToChooseColor = true;

			if(results.isWildDrawFour === true) {
				// Deal 4 cards to the next player 4 cards
				utilities.drawCards(4, false)
				.then((cards) => {
					return utilities.addCardsToPlayerHand(nextPlayerId, cards);
				});
			}

			// Add the card to the discard pile
			return utilities.removeFromHandAndAddToDiscard(req.body.playerId, req.body.cardId)
			.then((results) => {
				// Set hasDiscarded
				return utilities.setPlayerHasDiscarded(req.body.playerId, true);
			})
			.then((results) => {
				return utilities.setPlayerColorPending(req.body.playerId, true);
			})
			.then((results) => {
				return Promise.resolve(true);
			})
		} else {
			// Execution should reach here if the card being discarded is not a WILD card
			resultObj.needToChooseColor = false;

			// Handle card matching for non WILD cards
			return utilities.doesCardMatch(req.body.cardId)
		}
	})
	.then((results) => {
		resultObj.cardMatch = results;

		// If cards match and card discarded was not a WILD, execute card play
		if(results === true && (resultObj.isWild === false) && resultObj.isWildDrawFour === false) {
			matchedOnColorOrNumber = true;

			console.log("Cards matched execute playCard()");

			return utilities.playCard(req.body.cardId, req.body.playerId, nextPlayerId);	
		} else if(results === false) {
			// The card that was discarded did not match the one on the discard pile
			// Fix the result object so that the next player is still the current player
			resultObj.nextPlayerId = resultObj.playerId;
		}

		return Promise.resolve(true);
	})
	.then((results) => {
		if(matchedOnColorOrNumber === true) {
			resultObj.nextPlayerId = Number(results.nextPlayer);
		}

		// Finally, after all that, check if this Player is the winner!!!!
		return utilities.totalCardsInHand(req.body.playerId);
	})
	.then((count) => {

		if(count[0].dataValues.total_cards === 0) {
			resultObj.isWinner = true;
		} else {
			resultObj.isWinner = false;
		}

		res.status(200).json(resultObj);
	})
	.catch((error) => res.status(500).json( { error: utilities.createErrorMessageJSON("Error encountered while discarding card for player", error) } ) );
});

// Route for TESTING ONLY!
router.get("/game/test/:cardId", (req, res) => {
	utilities.doesPlayerOwnCard(1, req.params.cardId)
	.then((results) => {
		console.log(results);
		res.status(200).json(results);
	})
});

// Gets the hand for the specified player
router.get("/game/hand/:playerId", (req, res) => {
	console.log(req.path);

	let resultObj = {};
	resultObj.playerId = Number(req.params.playerId);

	Hands.findAll({
		where: {
			userId: req.params.playerId
		}
	})
	.then((hand) => {
		if(hand === null || hand.length === 0) {
			throw new Error("No cards found for specified player.  Make sure cards have been dealt.");
		}

		// Get each card
		const getCardPromises = [];

		for(let i=0; i<hand.length; i++) {
			let promise = utilities.getCard(hand[i].cardId);
			getCardPromises.push(promise);
		}

		return Promise.all(getCardPromises);
	})
	.then((results) => {
		resultObj.hand = results;

		res.status(200).json(resultObj);
	})
	.catch((error) => res.status(500).json( { error: utilities.createErrorMessageJSON("Error encountered while retrieving players hand", error) } ) );
});

// Returns the current deck
router.get("/game/deck", (req, res) => {
	console.log(req.path);

	Deck.findAll()
	.then((deck) => {
		if(deck === null || deck.length === 0) {
			return Promise.resolve([]);
		}

		const promises = [];

		for(let i=0; i<deck.length; i++) {
			let promise = utilities.getCard(deck[i].cardId);
			promises.push(promise);
		}

		return Promise.all(promises);
	})
	.then((results) => {
		res.status(200).json(results);
	})
	.catch((error) => res.status(500).json( { error: utilities.createErrorMessageJSON("Error encountered while retrieving deck", error) } ) );
});

// Returns the Player whose turn it is
router.get("/game/player/current/turn", (req, res) => {
	console.log(req.path);

	utilities.getTurn()
	.then((results) => {
		if(results === null || results.length === 0) {
			throw new Error("No players found");
		}
		res.status(200).json(results[0]);
	})
	.catch((error) => res.status(500).json( { error: utilities.createErrorMessageJSON("Error encountered while checking for whose turn it is", error) } ) );
});

// Passes the player's turn and sets it to the next player
router.put("/game/pass", (req, res) => {
	console.log(req.path);

	let nextPlayerId = null;

	let resultObj = {};

	// Start by checking if it is the player's turn
	utilities.isPlayerTurn(req.body.playerId)
	.then((user) => {
		if(user === null || user.length === 0) {
			throw new Error("User not found");
		}


		if(user[0].isTurn === false) {
			throw new Error("Not your turn yet");
		}

		// Check if this Player has either drawn or discarded.  Can't pass if no draw or discard baby!
		return utilities.getPlayerHasDrawn(req.body.playerId);
	})
	.then((drawn) => {
		if(drawn.userHasDrawn === false) {

			// Check if they have discarded
			return utilities.getPlayerHasDiscarded(req.body.playerId)
			.then((discard) => {
				console.log("======>", discard);
				if(discard.userHasDiscarded === false) {
					throw new Error("Player has not drawn or discarded a card yet");
				} 

				// Grab the next player
				return utilities.getNextPlayer();

			});
		}

		// Grab the next player
		return utilities.getNextPlayer();
	})
	.then((results) => {
		 nextPlayerId = results[0].id;

		 resultObj.nextPlayerId = nextPlayerId;

		// Pass the player's turn
		return utilities.setPlayerTurn(req.body.playerId, false);
	})
	.then((results) => {
		// Next Player's turn
		return utilities.setPlayerTurn(nextPlayerId, true);
	})
	.then((results) => {
		// Set hasDrawn value for this Player to false in preparation for next turn
		return utilities.setPlayerHasDrawn(req.body.playerId, false);
	})
	.then((results) => {
		// Set hasDiscarded value for this Player to false in preparation for next turn
		return utilities.setPlayerHasDiscarded(req.body.playerId, false);
	})
	.then((results) => {
		res.status(200).json(resultObj);
	})
	.catch((error) => res.status(500).json( { error: utilities.createErrorMessageJSON("Error encountered while passing player turn", error) } ) );
});

// Changes the color of a WILD card currently on top of discard pile
router.put("/game/discard/topcard", (req, res) => {
	console.log(req.path);

	let cardObj = null;
	let resultObj = {};

	// Check if card on top is a WILD card
	utilities.topCardOnDiscard()
	.then((card) => {
		if(card === null || card.length === 0) {
			throw new Error("No cards found on discard pile.  Make sure a game has been started");
		}

		cardObj = card;
		resultObj.originalCard = card;

		return utilities.isWildCard(card[0].cardId)
	})
	.then((results) => {
		resultObj.isWild = results.isWildCard;
		resultObj.isWildDrawFour = results.isWildDrawFour;

		if(results.isWildCard === false && results.isWildDrawFour === false) {
			throw new Error("Only WILD cards can have their color changed.");
		}

		return utilities.setWildCardColor(cardObj[0].cardId, req.body.colorName);
	})
	.then((results) => {
		resultObj.colorChoice = req.body.colorName;

		// Get the updated card
		return utilities.topCardOnDiscard();
	})
	.then((updatedCard) => {
		// Add the updated card
		resultObj.updatedCard = updatedCard;

		// Get the next Player
		return utilities.getNextPlayer();
	})
	.then((nextPlayer) => {
		resultObj.nextPlayer = nextPlayer[0].id;

		// Set next Player turn to true
		return utilities.setPlayerTurn(nextPlayer[0].id, true);
	})
	.then((results) => {
		resultObj.player = Number(req.body.playerId);

		// Set current Player turn to false
		return utilities.setPlayerTurn(Number(req.body.playerId), false);
	})
	.then((results) => {
		res.status(200).json(resultObj);
	})
	.catch((error) => res.status(500).json( { error: utilities.createErrorMessageJSON("Error encountered while changing color for WILD card", error) } ) );
});

// Gets the total number of players currently signed in
router.get("/game/total/players", (req, res) => {
	console.log(req.path);

	utilities.totalPlayers()
	.then((results) => {
		res.status(200).json(results);
	})
	.catch((error) => res.status(500).json( { error: utilities.createErrorMessageJSON("Error encountered while attempting to extract number of players", error) } ) );
});

// Gets the top card on the discard pile
router.get("/game/discard/topcard", (req, res) => {
	console.log(req.path);

	let resultObj = {};

	utilities.topCardOnDiscard()
	.then((card) => {
		resultObj.discard = card;

		if(card === null || card.length === 0) {
			throw new Error("No cards found on discard pile.  Make sure a game has been started");
		}

		return utilities.getCard(card[0].cardId)
	})
	.then((card) => {
		resultObj.card = card;

		res.status(200).json(resultObj);
	})
	.catch((error) => res.status(500).json( { error: utilities.createErrorMessageJSON("Error encountered while attempting to extract top card from discard pile", error) } ) );
})

router.delete("/game/player", (req, res) => {
	console.log(req.path);

	utilities.deletePlayer(req.body.playerId)
	.then((results) => {
		res.status(200).json("OK");
	})
	.catch((error) => res.status(500).json( { error: utilities.createErrorMessageJSON("Error encountered while attempting to delete player", error) } ) );
})

module.exports = router;