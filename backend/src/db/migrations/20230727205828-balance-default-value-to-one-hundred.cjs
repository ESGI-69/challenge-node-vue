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
    await queryInterface.changeColumn('users', 'balance', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 100,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('users', 'balance', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 50, // Assuming the original default value was 0. If it was different, replace it accordingly.
    });
  },
};
