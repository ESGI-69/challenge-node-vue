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
        image: 'default.png',
        cost: 4,
        rarity: 'common',
        type: 'spell',
        attack: 6,
        health: null,
        description: 'Deal 6 damage.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Fireball 2',
        image: 'default.png',
        cost: 4,
        rarity: 'common',
        type: 'minion',
        attack: 2,
        health: 3,
        description: 'Deal 6 damage.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Fireball 3',
        image: 'default.png',
        cost: 4,
        rarity: 'common',
        type: 'minion',
        attack: 2,
        health: 3,
        description: 'Deal 6 damage.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Fireball 4',
        image: 'default.png',
        cost: 4,
        rarity: 'common',
        type: 'minion',
        attack: 2,
        health: 3,
        description: 'Deal 6 damage.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Fireball 5',
        image: 'default.png',
        cost: 4,
        rarity: 'common',
        type: 'minion',
        attack: 2,
        health: 3,
        description: 'Deal 6 damage.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Instant Death',
        image: 'default.png',
        cost: 10,
        rarity: 'legendary',
        type: null,
        attack: null,
        health: null,
        description: 'Kill your opponent.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Instant Death 2',
        image: 'default.png',
        cost: 10,
        rarity: 'legendary',
        type: null,
        attack: null,
        health: null,
        description: 'Kill your opponent.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Pillgrim',
        image: 'default.png',
        cost: 2,
        rarity: 'common',
        type: 'minion',
        attack: 2,
        health: 2,
        description: 'Battlecry: Draw a card.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Explosive Shot',
        image: 'default.png',
        cost: 5,
        rarity: 'rare',
        type: 'spell',
        attack: null,
        health: null,
        description: 'Deal 5 damage to a minion and 2 damage to adjacent ones.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Explosive Shot 2',
        image: 'default.png',
        cost: 5,
        rarity: 'rare',
        type: 'spell',
        attack: null,
        health: null,
        description: 'Deal 5 damage to a minion and 2 damage to adjacent ones.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Explosive Shot 3',
        image: 'default.png',
        cost: 5,
        rarity: 'rare',
        type: 'spell',
        attack: null,
        health: null,
        description: 'Deal 5 damage to a minion and 2 damage to adjacent ones.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Abominable Bowman',
        image: 'default.png',
        cost: 7,
        rarity: 'epic',
        type: 'minion',
        attack: 6,
        health: 7,
        description: 'Deathrattle: Summon a random friendly Beast that died this game.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Abominable Bowman 2',
        image: 'default.png',
        cost: 7,
        rarity: 'epic',
        type: 'minion',
        attack: 6,
        health: 7,
        description: 'Deathrattle: Summon a random friendly Beast that died this game.',
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
    await queryInterface.bulkDelete('cards', null, {});
  },
};
