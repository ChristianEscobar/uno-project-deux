module.exports = function(sequelize, DataTypes) {
    const Users = sequelize.define("Users", {
      id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      totalWins: {
        type:DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      totalLosses: {
        type:DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      isPlaying: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      isTurn: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      hasDrawn: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      hasDiscarded: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      colorPending: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    });

    return Users;
  };