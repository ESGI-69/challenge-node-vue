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
        user_id: 1,
        card_id: 1,
      },
      {
        user_id: 1,
        card_id: 2,
      },
      {
        user_id: 2,
        card_id: 2,
      },
      {
        user_id: 2,
        card_id: 3,
      },
      {
        user_id: 3,
        card_id: 3,
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
  }
};
