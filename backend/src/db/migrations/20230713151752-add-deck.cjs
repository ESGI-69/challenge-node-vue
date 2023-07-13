'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('decks', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });

    await queryInterface.createTable('deck_cards', {
      cardId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cards',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      deckId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'decks',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      createdAt: Sequelize.DATE,
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('deck_cards');
    await queryInterface.dropTable('decks');
  },
};
