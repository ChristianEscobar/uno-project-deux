/*
const Enum = require("enum");

module.exports = new Enum({
	// Card colors
	
	"RED": 1,
	"GREEN": 2,
	"BLUE": 3,
	"YELLOW": 4
}, "Colors");
*/

module.exports = function(sequelize, DataTypes) {
	const Colors = sequelize.define("Colors", {
		color: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		colorValue: {
			type: DataTypes.INTEGER,
			allowNull: false,
			unique: true
		}
	});

	// Add instance methods
	// Short function notation i.e () => {} does not work here!!!! wth!!!
	Colors.prototype.getColor = function() {
		return this.color;
	}

	Colors.prototype.getColorValue = function() {
		return this.colorValue;
	}

	return Colors;
};