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
    await queryInterface.addColumn('users', 'balance', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 50,
    });

    await queryInterface.createTable('packs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      openedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      createdAt: Sequelize.DATE,
    });

    await queryInterface.createTable('pack_cards', {
      packId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'packs',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      cardId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cards',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      createdAt: Sequelize.DATE,
    });
  },

  async down (queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('pack_cards');
    await queryInterface.dropTable('packs');
    await queryInterface.removeColumn('users', 'balance');
  },
};
