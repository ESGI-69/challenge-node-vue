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
    // add coins product
    await queryInterface.bulkInsert('products', [
      {
        name: '11000 Coins',
        price: 10,
        categorie: 'COINS',
        value: 11000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: '5000 Coins',
        price: 5,
        categorie: 'COINS',
        value: 5000,
        createdAt: new Date(),
        updatedAt: new Date(),
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
    await queryInterface.bulkDelete('products', null, {});
  },
};
