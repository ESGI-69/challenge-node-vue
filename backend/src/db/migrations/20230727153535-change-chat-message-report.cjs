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
    await queryInterface.removeColumn('chat_messages', 'reportCount');
    await queryInterface.addColumn('chat_messages', 'isReportedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.addColumn('chat_messages', 'reportCount', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.removeColumn('chat_messages', 'isReportedAt');
  },
};
