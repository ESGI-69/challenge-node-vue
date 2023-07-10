'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.createTable('games', {
      id: {
        type: Sequelize.STRING(6),
        primaryKey: true,
      },
      first_player: {
        type: Sequelize.INTEGER,
        references : {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      second_player: {
        type: Sequelize.INTEGER,
        references : {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: true,
        defaultValue: null,
      },
      winner: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      endAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down (queryInterface) {

    await queryInterface.dropTable('games');
  },
};
