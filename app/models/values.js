/*
const Enum = require("enum");

module.exports = new Enum({
	// Card numbers
	"ZERO": 0,
	"ONE": 1,
	"TWO": 2,
	"THREE": 3,
	"FOUR": 4,
	"FIVE": 5,
	"SIX": 6,
	"SEVEN": 7,
	"EIGHT": 8,
	"NINE": 9,
	// Special
	"DRAW_TWO": 10,
	"REVERSE": 11,
	"SKIP": 12,
	"WILD": 13,
	"WILD_DRAW_FOUR": 14
}, "Values");
*/

module.exports = function(sequelize, DataTypes) {
	const Values = sequelize.define("Values", {
		card: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		value: {
			type: DataTypes.INTEGER,
			allowNull: false,
			unique: true
		}
	});

	// Add instance methods
	// Short function notation i.e () => {} does not work here!!!! wth!!!
	Values.prototype.getCard = function() {
		return this.card;
	}

	Values.prototype.getValue = function() {
		return this.Value;
	}

	return Values;
};