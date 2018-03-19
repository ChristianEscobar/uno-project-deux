'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('Colors', [{
      color: "RED",
      colorValue: 1,
      createdAt: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
      updatedAt: Sequelize.literal('CURRENT_TIMESTAMP(3)')
    },{
      color: "GREEN",
      colorValue: 2,
      createdAt: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
      updatedAt: Sequelize.literal('CURRENT_TIMESTAMP(3)')
    },{
      color: "BLUE",
      colorValue: 3,
      createdAt: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
      updatedAt: Sequelize.literal('CURRENT_TIMESTAMP(3)')
    },{
      color: "YELLOW",
      colorValue: 4,
      createdAt: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
      updatedAt: Sequelize.literal('CURRENT_TIMESTAMP(3)')
    },{
      color: "NO_COLOR", // Used for WILD cards
      colorValue: 5,
      createdAt: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
      updatedAt: Sequelize.literal('CURRENT_TIMESTAMP(3)')
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
