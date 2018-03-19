$(window).on("beforeunload", function(event) {
	console.log("LEAVING");
});

$("start-btn").on("click", function(event) {
	$.post("/game/start", function(response) {
		console.log(response);
	});
})

$(document).ready(function() {
	let totalPlayers = 0;

	waitForPlayers();
});

function waitForPlayers() {

	$.get("/game/total/players")
		.done(function(response) {
			totalPlayers = response.count[0].total_players;

			console.log(totalPlayers);

			if(totalPlayers === 2) {
				// Start game
				$.post("/game/start") 
					.done(function(response) {
						return;
					})
					.fail(function(error) {
						console.log(error);
					});

			} else {
				setTimeout(waitForPlayers(), 1000);
			}
		})
		.fail(function(error) {
			console.log("failed");
			console.log(error);
		});
}