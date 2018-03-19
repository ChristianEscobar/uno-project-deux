
;(function(window){
	// Placing Deck in Div
	var DeckPlacement = function(el, option){
		this.el = document.getElementById(el);
		this.option = option;

		this.deck_div = document.createElement("div");
		this.deck_div.id = "deck_div";
		this.gameDeck = new Deck(this.deck_div, option);
		this.gameDeck.buildDeck();

		this.el.appendChild(this.deck_div);

	};

	// Deck building
	// Deck
	var Deck = function(deck_div, option){

		this.deckData = option.data;
		this.buildDeck = function(){
			var parentFrag = document.createDocumentFragment();
			deck_div.innerHTML = "";
			for (var i = this.deckData.length - 1; i >= 0; i--) {
				var card = new Card();
				card.id = "card-" + i;
				card.data = this.deckData[i].card[0];
				card.buildCard(parentFrag);
			};
			deck_div.appendChild(parentFrag);

		};


	};

	// Placemnet of user's hand in div
	var HandPlacement = function(el, option){
		this.el = document.getElementById(el);
		this.option = option;

		this.hand = document.createElement("div");
		this.hand.id = "hand";
		this.gameHand = new Hand(this.hand, option);
		this.gameHand.buildHand();

		this.el.appendChild(this.hand);

	};

	//Player's hand build
	var Hand = function(hand, option){

		this.handData = option.data;
		this.buildHand = function(){
			var parentFrag = document.createDocumentFragment();
			hand.innerHTML = "";
			for (var i = this.handData.length - 1; i >= 0; i--) {
				var card = new Card();
				card.id = "card-" + i;
				card.data = this.handData[i].card[0];
				card.buildCard(parentFrag);
			};
			hand.appendChild(parentFrag);

		};
	};

	// Discard Pile Placement
	var DiscardPlacement = function(el, option){

		this.el = document.getElementById(el);
		this.option = option;

		this.discard = document.createElement("div");
		this.discard.id = "discard";
		this.gameDiscard = new Discard(this.discard, option);
		this.gameDiscard.buildDiscard();

		this.el.appendChild(this.discard);

	}

	//Discard Pile build
	var Discard = function(discard, option){

		this.discardData = option.data;
		this.buildDiscard = function(){
			var parentFrag = document.createDocumentFragment();
			discard.innerHTML = "";
			for (var i = Object.keys(this.discardData).length - 1; i >= 0; i--) {
				var card = new Card();
				card.id = "card-" + i;
				card.data = this.discardData.card.card[i];
				console.log(card.data);
				card.buildCard(parentFrag);
			};
			discard.appendChild(parentFrag);

		};
	};

	// Card Creation
	var Card = function(){
		this.id = "";
		this.data = "";
		this.cardCont = document.createElement("div");
		this.cardCont.className = "card_container guide1";
		this.cardFront = document.createElement("div");
		this.cardFront.className = "card_front";
		this.cardBack = document.createElement("div");
		this.cardBack.className = "card_back";
		this.buildCard = function(parentFrag){
			var flipDiv = document.createElement("div"),
				frontImg = document.createElement("img"),
				backImg = document.createElement("img")
			flipDiv.className = "flip";
			frontImg.className = "front_val responsive-img card-display";
			backImg.className = "back_val responsive-img card-display";

			var cardBack = "assets/images/cards/small/card_back_alt.png"

			frontImg.src = "assets/images/cards/small/" + this.data.smallImage;
			backImg.src = cardBack;

			this.cardFront.appendChild(frontImg);
			this.cardBack.appendChild(backImg);

			flipDiv.appendChild(this.cardFront);
			flipDiv.appendChild(this.cardBack);

			this.cardCont.id = this.id;
			this.cardCont.appendChild(flipDiv);

			this.cardCont.onclick = function(e){
				console.log(e.target, e.currentTarget);
				console.log(e.currentTarget.className, e.currentTarget.classList);
				console.log(this);
			}

			parentFrag.appendChild(this.cardCont);
		}
	}

	window.DeckPlacement = DeckPlacement;
	window.HandPlacement = HandPlacement;
	window.DiscardPlacement = DiscardPlacement;

})(window);
