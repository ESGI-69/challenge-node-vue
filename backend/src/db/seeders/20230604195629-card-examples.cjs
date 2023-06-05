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
    await queryInterface.bulkInsert('cards', [
      {
        name: 'Fireball',
        image: 'https://picsum.photos/200/300',
        cost: 4,
        rarity: 'common',
        type: 'spell',
        attack: 6,
        health: null,
        description: 'Deal 6 damage.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Instant Death',
        image: 'https://picsum.photos/200/300',
        cost: 10,
        rarity: 'legendary',
        type: null,
        attack: null,
        health: null,
        description: 'Kill your opponent.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Pillgrim',
        image: 'https://picsum.photos/200/300',
        cost: 2,
        rarity: 'common',
        type: 'minion',
        attack: 2,
        health: 2,
        description: 'Battlecry: Draw a card.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Cards', null, {});
  }
};
