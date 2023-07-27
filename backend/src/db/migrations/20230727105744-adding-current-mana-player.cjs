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
    await queryInterface.addColumn('games', 'first_player_current_mana', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });

    await queryInterface.addColumn('games', 'second_player_current_mana', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });

  },

  async down (queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('games', 'first_player_current_mana');
    await queryInterface.removeColumn('games', 'second_player_current_mana');
  },
};
