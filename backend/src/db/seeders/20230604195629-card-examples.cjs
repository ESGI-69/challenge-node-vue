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
        image: 'https://art.hearthstonejson.com/v1/orig/EX1_001.png',
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
        name: 'Fireball 2',
        image: 'https://art.hearthstonejson.com/v1/orig/EX1_001.png',
        cost: 4,
        rarity: 'common',
        type: 'minion',
        attack: 2,
        health: 3,
        description: 'Deal 6 damage.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Fireball 3',
        image: 'https://art.hearthstonejson.com/v1/orig/EX1_001.png',
        cost: 4,
        rarity: 'common',
        type: 'minion',
        attack: 2,
        health: 3,
        description: 'Deal 6 damage.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Fireball 4',
        image: 'https://art.hearthstonejson.com/v1/orig/EX1_001.png',
        cost: 4,
        rarity: 'common',
        type: 'minion',
        attack: 2,
        health: 3,
        description: 'Deal 6 damage.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Fireball 5',
        image: 'https://art.hearthstonejson.com/v1/orig/EX1_001.png',
        cost: 4,
        rarity: 'common',
        type: 'minion',
        attack: 2,
        health: 3,
        description: 'Deal 6 damage.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Instant Death',
        image: 'https://art.hearthstonejson.com/v1/orig/EX1_116.png',
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
        name: 'Instant Death 2',
        image: 'https://art.hearthstonejson.com/v1/orig/EX1_116.png',
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
        image: 'https://art.hearthstonejson.com/v1/orig/CS2_073.png',
        cost: 2,
        rarity: 'common',
        type: 'minion',
        attack: 2,
        health: 2,
        description: 'Battlecry: Draw a card.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Explosive Shot',
        image: 'https://art.hearthstonejson.com/v1/orig/EX1_537.png',
        cost: 5,
        rarity: 'rare',
        type: 'spell',
        attack: null,
        health: null,
        description: 'Deal 5 damage to a minion and 2 damage to adjacent ones.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Explosive Shot 2',
        image: 'https://art.hearthstonejson.com/v1/orig/EX1_537.png',
        cost: 5,
        rarity: 'rare',
        type: 'spell',
        attack: null,
        health: null,
        description: 'Deal 5 damage to a minion and 2 damage to adjacent ones.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Explosive Shot 3',
        image: 'https://art.hearthstonejson.com/v1/orig/EX1_537.png',
        cost: 5,
        rarity: 'rare',
        type: 'spell',
        attack: null,
        health: null,
        description: 'Deal 5 damage to a minion and 2 damage to adjacent ones.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Abominable Bowman',
        image: 'https://art.hearthstonejson.com/v1/orig/ICC_825.png',
        cost: 7,
        rarity: 'epic',
        type: 'minion',
        attack: 6,
        health: 7,
        description: 'Deathrattle: Summon a random friendly Beast that died this game.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Abominable Bowman 2',
        image: 'https://art.hearthstonejson.com/v1/orig/ICC_825.png',
        cost: 7,
        rarity: 'epic',
        type: 'minion',
        attack: 6,
        health: 7,
        description: 'Deathrattle: Summon a random friendly Beast that died this game.',
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
    await queryInterface.bulkDelete('cards', null, {});
  }
};
