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
    await queryInterface.createTable('hands', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      game_id: {
        type: Sequelize.STRING(6),
        allowNull: false,
        references: {
          model: 'games',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    });

    await queryInterface.createTable('hand_cards', {
      HandId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'hands',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      CardId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cards',
          key: 'id',
        },
      },
    });

    await queryInterface.addColumn('games', 'first_player_hand', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'hands',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addColumn('games', 'second_player_hand', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'hands',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down (queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('hand_cards');
    await queryInterface.dropTable('hands');
    await queryInterface.removeColumn('games', 'first_player_hand');
    await queryInterface.removeColumn('games', 'second_player_hand');
  },
};
