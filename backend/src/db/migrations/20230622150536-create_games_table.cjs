'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.createTable('games', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      first_player: {
        type: Sequelize.INTEGER,
        references : {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      second_player: {
        type: Sequelize.INTEGER,
        references : {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: true,
        validate: {
          notEmpty: true
        }
      },
      winner: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          notEmpty: true
        }
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });


   
  },

  async down (queryInterface, Sequelize) {
  
    await queryInterface.dropTable('games');
  }
};
