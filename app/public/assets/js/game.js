"use strict"

const playerHandURL = "/game/hand/" + sessionStorage.playerId;

const deckURL = "/game/deck";

const discardURL = "/game/discard/topcard";

const startGameURL = "/game/start";

const dealHand = function(playerHand) {

	playerHand.forEach( element => {
		let imgTag = $("<img></img>");

		imgTag.addClass("responsive-img card-display");

		imgTag.attr("src", element.smallImage);

		imgTag.attr("card-id", element.id);

		$("#hand").append(imgTag);
	});
};	


// Initialize the game
$(document).ready(function(event) {
	console.log(sessionStorage.master);
	if(sessionStorage.master) {
		console.log("Starting new game...");

		$.post(startGameURL)
		.then( response => {
			console.log("Game setup complete.");

			return $.get(playerHandURL)
		})
		.then( playerHand => {
			console.log(playerHand);



			const currentHand = new HandPlacement("hand", {object: "hand", data: playerHand.hand});
		})
		.catch( error => console.error(error));
	} else {
		isGameReady(deckURL)
		.then( gameReadyResult => {
			return $.get(playerHandURL) 
		})
		.then( playerHand => {
			console.log(playerHand);
		})
		.catch( error => console.error(error));
	}
});

function isGameReady() {
	return $.get(deckURL)
	.then( deck => {
		// Hard coding initial number of cards expected to be in the deck at the start of a game.
		if(deck.length > 93) {
			console.log("Game is ready.");

			return Promise.resolve(true);

		} else {
			setTimeout(isGameReady(), 1000);
		}
	})
	.catch( error => console.error(error));
}

/*
function setupBoard() {
	refreshDeck()
	.then((results) => {
		refreshDiscard();
	})
	.then( results => {
		console.log("setupBoard() done");
	})
	.catch((error) => console.error((error)));
}

function refreshDeck() {
	return $.get(deckURL)
	.then( deck => {
		const gameDeck = new DeckPlacement("draw_pile", {object: "draw", data: deck});

		return Promise.resolve(true);
	})
	.catch((error) => console.error(error));
}

function refreshDiscard() {
	$.get(discardURL)
	.then( discard => {
		console.log("====> Discard", discard.card.card);
		const gameDiscard = new DiscardPlacement("discard_pile", {object: "discard", data: discard.card.card[0]});

		return Promise.resolve(true);
	})
	.catch( error => console.error(error));
}
*/