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
    }
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
      winner: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        validate: {
          notEmpty: true,
        },
      },
      endAt: {
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
    },
  );
  return Game;

};
