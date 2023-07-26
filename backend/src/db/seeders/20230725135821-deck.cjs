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
    // Create 2 decks
    await queryInterface.bulkInsert('decks', [
      {
        name: 'Deck 1',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Deck 2',
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Deck 3',
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Select favorite deck for each user
    await queryInterface.bulkUpdate('users', {
      idDeckFav: 1,
    }, {
      id: 1,
    });
    await queryInterface.bulkUpdate('users', {
      idDeckFav: 2,
    }, {
      id: 2,
    });
    await queryInterface.bulkUpdate('users', {
      idDeckFav: 3,
    }, {
      id: 3,
    });

    await queryInterface.bulkInsert('deck_cards', [
      {
        deckId: 1,
        cardId: 1,
        createdAt: new Date(),
      },
      {
        deckId: 1,
        cardId: 2,
        createdAt: new Date(),
      },
      {
        deckId: 1,
        cardId: 7,
        createdAt: new Date(),
      },
      {
        deckId: 1,
        cardId: 8,
        createdAt: new Date(),
      },
      {
        deckId: 1,
        cardId: 9,
        createdAt: new Date(),
      },
      {
        deckId: 2,
        cardId: 2,
        createdAt: new Date(),
      },
      {
        deckId: 2,
        cardId: 3,
        createdAt: new Date(),
      },
      {
        deckId: 2,
        cardId: 4,
        createdAt: new Date(),
      },
      {
        deckId: 2,
        cardId: 5,
        createdAt: new Date(),
      },
      {
        deckId: 2,
        cardId: 6,
        createdAt: new Date(),
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
    await queryInterface.bulkDelete('decks', null, {});
    await queryInterface.bulkDelete('deck_cards', null, {});

    await queryInterface.bulkUpdate('users', {
      idDeckFav: null,
    }, {
      id: 1,
    });
    await queryInterface.bulkUpdate('users', {
      idDeckFav: null,
    }, {
      id: 2,
    });
    await queryInterface.bulkUpdate('users', {
      idDeckFav: null,
    }, {
      id: 3,
    });
  },
};
