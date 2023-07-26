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
    // Créer un game board pour chaque player lié à la game et au player

    await queryInterface.createTable('boards', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      game_id: {
        type: Sequelize.STRING(6),
        allowNull: false,
        references: {
          model: 'games',
          key: 'id',
        },
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
    // Créer une card instance pour chaque card sur le board avec une référence vers la card. Lié au board.
    await queryInterface.createTable('card_instances', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      game_board_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'boards',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      card_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cards',
          key: 'id',
        },
      },
      currentHealth: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      allreadyAttacked: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });

    await queryInterface.createTable('board_card_instances', {
      BoardId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'boards',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      CardInstanceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'card_instances',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    });

    await queryInterface.addColumn('games', 'first_player_board', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'boards',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addColumn('games', 'second_player_board', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'boards',
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
    await queryInterface.dropTable('boards');
    await queryInterface.dropTable('card_instances');
    await queryInterface.removeColumn('games', 'first_player_board');
    await queryInterface.removeColumn('games', 'second_player_board');
  },
};
