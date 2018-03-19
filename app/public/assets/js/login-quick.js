"scrict mode"

let totalPlayers = 0;

$(window).on("beforeunload", function(event) {
	// Remove this Player from the database
	$.delete("/game/player", {playerId: sessionStorage.playerId})
	.done(function(response) {
		console.log("Successful logout");
	})
	.fail(function(error) {
		console.log(error);
	});

});

$(document).ready(function(){
	// the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
 	$('.modal').modal();

 	// clear session storage
 	sessionStorage.clear();

 	// Start checking Player status
 	//checkForPlayers();

 	// Disable play button
 	$("#play-btn").prop("disabled", true);
});

$("#name").on("keyup", function() {
	const name = $("#name").val().trim();

	// Only enable Play button when name is not empty.
	if(name.length === 0) {
		$("#play-btn").prop("disabled", true);
	} else {
		$("#play-btn").prop("disabled", false);
	}
});

$("#login-btn").on("click", function(event) {
	$.get("/game/total/players")
 	.done(function(response) {
 		totalPlayers = response.count[0].total_players;

 		if(totalPlayers >= 2) {
 			$("#play-btn").prop("disabled", true);

 			$("#user-messages").text("Enough players have joined.  Try again later.");
 		}
 	})
 	.fail(function(error) {
 		console.log(error);
 	});
});

$("#play-btn").on("click", function() {
	const playerName = $("#name").val().trim();

	$.post("/game/player", {name: playerName}, function(result){

		if(result.id > 0) {
			sessionStorage.setItem("playerId", result.id);

			// Disable the play button and wait for other players
			$("#play-btn").prop("disabled", true);

      var waitMessage = document.createElement("p");
      waitMessage.innerHTML = "Waiting for a second player."
      var waitBar = document.createElement("div");
      var waitContain = document.createElement("div");
      waitContain.className = "progress";
      waitContain.appendChild(waitBar);
      $('#wait_indicator').append(waitMessage);
      $('#wait_indicator').append(waitContain);

			waitForPlayers();
		}
	});
});

// Will wait until 2 players are in the database before starting a new game.
function waitForPlayers() {

	$.get("/game/total/players")
		.done(function(response) {
			totalPlayers = response.count[0].total_players;

			//console.log(totalPlayers);

			if(totalPlayers === 2) {
				// Start game, only the master player will call /game/start
				if(sessionStorage.master === true) {
					$.post("/game/start")
					.then((response) => window.location = "game.html")
					.catch((error) => console.log(error));
				} else {
					window.location = "game.html";
				}
				

			} else {
				// If execution reaches here, that means there are no players waiting, so this player becomes the master
				sessionStorage.setItem("master", true);

				setTimeout(waitForPlayers(), 1000);
			}
		})
		.fail(function(error) {
			console.log(error);
		});
}

/*
function checkForPlayers() {

	$.get("/game/total/players")
		.done(function(response) {
			totalPlayers = response.count[0].total_players;

			if(totalPlayers === 2) {
				$("#play-btn").prop("disabled", true);

				$("#waiting-msg").text("Enough players have joined the game.");

			} else {
				$("#waiting-msg").text("Waiting for players to join.");

				$("#play-btn").prop("disabled", false);
			}

			setTimeout(checkForPlayers(), 1000);

		})
		.fail(function(error) {
			console.log(error);
		});
}*/
