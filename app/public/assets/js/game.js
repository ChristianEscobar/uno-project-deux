const playerHandURL = "/game/hand/" + sessionStorage.playerId;

const deckURL = "/game/deck";

const startGameURL = "/game/start";


// Initialize the game
$(document).ready(function(event) {
	console.log(sessionStorage.master);
	if(sessionStorage.master) {
		console.log("Starting new game...");

		$.post(startGameURL)
		.then((response) => {
			setupBoard();
		})
		.catch((error) => console.error(error));
	} else {
		isGameReady(deckURL);
	}
});

function isGameReady() {
	return $.get(deckURL)
	.then((deck) => {
		if(deck.length > 0) {
			console.log("Game is ready.");

			setupBoard();
		} else {
			setTimeout(isGameReady(), 1000);
		}
	})
	.catch((error) => console.error(error));
}

function setupBoard() {
	$.get(deckURL)
	.then((deck) => {
		const gameDeck = new DeckPlacement("draw_pile", {object: "draw", data: deck});
	})
	.catch((error) => console.error(error));
}