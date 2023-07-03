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
    await queryInterface.addColumn('user_cards', 'obtainedAt', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });

    // Update missing obtainedAt values
    await queryInterface.sequelize.query(`
      UPDATE user_cards
      SET "obtainedAt" = NOW()
      WHERE "obtainedAt" IS NULL;
    `);

    // Make obtainedAt not nullable
    await queryInterface.changeColumn('user_cards', 'obtainedAt', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },

  async down (queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('user_cards', 'obtainedAt');
  },
};
