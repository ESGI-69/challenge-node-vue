'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('games', 'first_player_deck', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'decks',
        key: 'id',
      },
    });

    await queryInterface.addColumn('games', 'second_player_deck', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'decks',
        key: 'id',
      },
    });
  },

  async down (queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeColumn('games', 'first_player_deck');
    await queryInterface.removeColumn('games', 'second_player_deck');
  },
};
