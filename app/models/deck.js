  //const Colors = require("./colors");
  //const Values = require("./values");
  /*
    108 cards
    76x numbers (0-9, all colors)
    8x draw two (2x each color)
    8x reverse (2x each color)
    8x skip (2x each color)
    4x wild
    4x wild draw four
  */
  module.exports = function(sequelize, DataTypes) {
    const Deck = sequelize.define("Deck", {});

    return Deck;
  };