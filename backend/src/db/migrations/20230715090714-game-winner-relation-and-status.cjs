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
    await queryInterface.changeColumn('games', 'winner', {
      type: Sequelize.INTEGER,
      references : {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      allowNull: true,
    });
    await queryInterface.addColumn('games', 'endType', {
      type: Sequelize.ENUM('surrender', 'disconnect', 'health'),
      allowNull: true,
      defaultValue: null,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('games', 'winner', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    // await queryInterface.removeColumn('games', 'endType');
  },
};
