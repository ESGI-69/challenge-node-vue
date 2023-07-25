import { DataTypes, Model } from 'sequelize';

import { Deck, Hand, User } from '../index.js';

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
      this.belongsTo(Deck, { through: Deck, foreignKey: 'first_player_deck', as: 'firstPlayerDeck' });
      this.belongsTo(Deck, { through: Deck, foreignKey: 'second_player_deck', as: 'secondPlayerDeck' });
      this.belongsTo(Hand, { through: Hand, foreignKey: 'first_player_hand', as: 'firstPlayerHand' });
      this.belongsTo(Hand, { through: Hand, foreignKey: 'second_player_hand', as: 'secondPlayerHand' });
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
          len: [6, 6],
        },
      },
      first_player_mana: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          notEmpty: true,
          min: 1,
          max: 10,
        },
      },
      second_player_mana: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          notEmpty: true,
          min: 1,
          max: 10,
        },
      },
      turn_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          notEmpty: true,
          min: 0,
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
      first_player_hp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 20,
      },
      second_player_hp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 20,
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
            game.turn_count += 1;
            if (game.turn_count > 2) {
              if (game.turn_count % 2 === 0) {
                if (game.second_player_mana < 10) {
                  game.second_player_mana += 1;
                }
              } else {
                if (game.first_player_mana < 10) {
                  game.first_player_mana += 1;
                }
              }
            }
          }
        },
      },
    },
  );
  return Game;

};
