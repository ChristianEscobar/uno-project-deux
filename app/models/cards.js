module.exports = function(sequelize, DataTypes) {
	const Cards = sequelize.define("Cards", {
		
		smallImage: {
			type: DataTypes.STRING,
			allowNull: false
		},
		largeImage: {
			type: DataTypes.STRING,
			allowNull: false
		}
	});

	// Add instance methods
	// Short function notation i.e () => {} does not work here!!!! wth!!!
	/*
	Cards.prototype.getCard = function() {
		return this.card;
	};

	Cards.prototype.getValue = function() {
		return this.value;
	}

	Cards.prototype.getColor = function() {
		return this.color;
	}

	Cards.prototype.getColorValue = function() {
		return this.colorValue;
	}

	Cards.prototype.isWildCard = function() {
		return this.card === "WILD" || this.card === "WILD_DRAW_FOUR";	
	}

	Cards.prototype.isSpecialCard = function() {
		return this.isWildCard() || this.card.value === "DRAW_TWO" || this.card.value === "REVERSE" || this.card.value === "SKIP";
	}
	*/

	return Cards;
}