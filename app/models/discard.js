module.exports = function(sequelize, DataTypes) {
    const Discard = sequelize.define("Discard", {
    	chosenColor: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "NO_COLOR"
      },
      chosenColorSmallImage: {
      	type: DataTypes.STRING,
      	allowNull: false,
      	defaultValue: "NO_IMAGE"
      },
      chosenColorLargeImage: {
      	type: DataTypes.STRING,
      	allowNull: false,
      	defaultValue: "NO_IMAGE"
      }
    });

    return Discard;
  };