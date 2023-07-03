'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    // add user cards
    await queryInterface.bulkInsert('user_cards', [
      {
        userId: 1,
        cardId: 1,
        obtainedAt: new Date(),
      },
      {
        userId: 1,
        cardId: 2,
        obtainedAt: new Date(),
      },
      {
        userId: 1,
        cardId: 7,
        obtainedAt: new Date(),
      },
      {
        userId: 1,
        cardId: 8,
        obtainedAt: new Date(),
      },
      {
        userId: 1,
        cardId: 9,
        obtainedAt: new Date(),
      },
      {
        userId: 2,
        cardId: 2,
        obtainedAt: new Date(),
      },
      {
        userId: 2,
        cardId: 3,
        obtainedAt: new Date(),
      },
      {
        userId: 3,
        cardId: 3,
        obtainedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    // remove user cards
    await queryInterface.bulkDelete('user_cards', null, {});
  },
};
