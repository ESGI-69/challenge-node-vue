import { DataTypes, Model } from 'sequelize';

import { User } from '../index.js';

/**
 * @param {import('sequelize').Sequelize} connection
 */

export default (connection) => {
  class Game extends Model {
    static associate() {
      this.belongsTo(User, { through: User, foreignKey: 'first_player', as: 'firstPlayer' });
      this.belongsTo(User, { through: User, foreignKey: 'second_player', as: 'secondPlayer' });
      this.belongsTo(User, { through: User, foreignKey: 'winner', as: 'winnerPlayer' });
      this.belongsTo(User, { through: User, foreignKey: 'current_player', as: 'currentPlayer' });
    }

    /**
     * @type {import('mongoose').Model}
     */
    static mongoModel;

    /**
     * @type {import('mongoose').Schema}
     */
    static mongoSchema;
  }

  Game.init(
    {
      id: {
        type: DataTypes.STRING(6),
        primaryKey: true,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          max: 6,
          min: 6,
        },
      },
      endedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
        validate: {
          notEmpty: true,
        },
      },
      endType: {
        type: DataTypes.ENUM('surrender', 'disconnect', 'health'),
        allowNull: true,
        defaultValue: null,
        validate: {
          notEmpty: true,
        },
      },
      startedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
        validate: {
          notEmpty: true,
        },
      },
      turnStartedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize: connection,
      tableName: 'games',
      defaultScope: {
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      scopes: {
        withTimestamps: { attributes: {
          include: ['createdAt', 'updatedAt'],
        } },
      },
      getterMethods: {
        isInProgress() {
          return this.startedAt !== null && this.endedAt === null;
        },
        isEnded() {
          return this.endedAt !== null;
        },
        hasTwoPlayers() {
          return this.first_player !== null && this.second_player !== null;
        },
      },
      hooks: {
        // On turn change set turnStartedAt to current date
        beforeUpdate: (game) => {
          if (game.changed('current_player')) {
            game.turnStartedAt = new Date();
          }
        },
      },
    },
  );
  return Game;

};
