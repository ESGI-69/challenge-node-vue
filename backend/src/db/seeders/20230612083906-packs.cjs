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
    await queryInterface.bulkInsert('packs', [
      {
        userId: 1,
        createdAt: new Date(),
        openedAt: null,
      },
      {
        userId: 1,
        createdAt: new Date(),
        openedAt: null,
      },
      {
        userId: 2,
        createdAt: new Date(),
        openedAt: null,
      },
    ]);

    await queryInterface.bulkInsert('pack_cards', [
      {
        packId: 1,
        CardId: 1,
        createdAt: new Date(),
      },
      {
        packId: 1,
        CardId: 2,
        createdAt: new Date(),
      },
      {
        packId: 1,
        CardId: 2,
        createdAt: new Date(),
      },
      {
        packId: 1,
        CardId: 2,
        createdAt: new Date(),
      },
      {
        packId: 1,
        CardId: 3,
        createdAt: new Date(),
      },


      {
        packId: 2,
        CardId: 1,
        createdAt: new Date(),
      },
      {
        packId: 2,
        CardId: 2,
        createdAt: new Date(),
      },
      {
        packId: 2,
        CardId: 2,
        createdAt: new Date(),
      },
      {
        packId: 2,
        CardId: 2,
        createdAt: new Date(),
      },
      {
        packId: 2,
        CardId: 3,
        createdAt: new Date(),
      },

      {
        packId: 3,
        CardId: 1,
        createdAt: new Date(),
      },
      {
        packId: 3,
        CardId: 2,
        createdAt: new Date(),
      },
      {
        packId: 3,
        CardId: 2,
        createdAt: new Date(),
      },
      {
        packId: 3,
        CardId: 2,
        createdAt: new Date(),
      },
      {
        packId: 3,
        CardId: 3,
        createdAt: new Date(),
      },
    ]);

    // Add balance to users
    await queryInterface.bulkUpdate('users', {
      balance: 1000,
    }, {
      id: 1,
    });
  },

  async down (queryInterface) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('pack_cards', null, {});
    await queryInterface.bulkDelete('packs', null, {});
    await queryInterface.bulkUpdate('users', {
      balance: 50,
    }, {
      id: 1,
    });
  }
};
