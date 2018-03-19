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
    return queryInterface.bulkInsert('Values', [{
      card: 'ZERO',
      value: 0,
      createdAt: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
      updatedAt: Sequelize.literal('CURRENT_TIMESTAMP(3)')
    },{
      card: 'ONE',
      value: 1,
      createdAt: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
      updatedAt: Sequelize.literal('CURRENT_TIMESTAMP(3)')
    },{
      card: 'TWO',
      value: 2,
      createdAt: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
      updatedAt: Sequelize.literal('CURRENT_TIMESTAMP(3)')
    },{
      card: 'THREE',
      value: 3,
      createdAt: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
      updatedAt: Sequelize.literal('CURRENT_TIMESTAMP(3)')
    },{
      card: 'FOUR',
      value: 4,
      createdAt: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
      updatedAt: Sequelize.literal('CURRENT_TIMESTAMP(3)')
    },{
      card: 'FIVE',
      value: 5,
      createdAt: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
      updatedAt: Sequelize.literal('CURRENT_TIMESTAMP(3)')
    },{
      card: 'SIX',
      value: 6,
      createdAt: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
      updatedAt: Sequelize.literal('CURRENT_TIMESTAMP(3)')
    },{
      card: 'SEVEN',
      value: 7,
      createdAt: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
      updatedAt: Sequelize.literal('CURRENT_TIMESTAMP(3)')
    },{
      card: 'EIGHT',
      value: 8,
      createdAt: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
      updatedAt: Sequelize.literal('CURRENT_TIMESTAMP(3)')
    },{
      card: 'NINE',
      value: 9,
      createdAt: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
      updatedAt: Sequelize.literal('CURRENT_TIMESTAMP(3)')
    },{
      card: 'DRAW_TWO',
      value: 10,
      createdAt: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
      updatedAt: Sequelize.literal('CURRENT_TIMESTAMP(3)')
    },{
      card: 'REVERSE',
      value: 11,
      createdAt: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
      updatedAt: Sequelize.literal('CURRENT_TIMESTAMP(3)')
    },{
      card: 'SKIP',
      value: 12,
      createdAt: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
      updatedAt: Sequelize.literal('CURRENT_TIMESTAMP(3)')
    },{
      card: 'WILD',
      value: 13,
      createdAt: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
      updatedAt: Sequelize.literal('CURRENT_TIMESTAMP(3)')
    },{
      card: 'WILD_DRAW_FOUR',
      value: 14,
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
