'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.renameColumn('games', 'endAt', 'endedAt');
  },

  async down (queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.renameColumn('games', 'endedAt', 'endAt');
  },
};
