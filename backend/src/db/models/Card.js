import { DataTypes, Model } from 'sequelize';

import { Pack, Pack_Card, User, User_Card } from '../index.js';

/**
 * @param {import('sequelize').Sequelize} connection
 * @param {import('mongoose').Mongoose} mongoose
 */

export default (connection, mongoose) => {
  class Card extends Model {
    static mongoSchema = new mongoose.Schema({
      id: {
        type: Number,
        required: true,
        unique: true,
      },
      name: {
        type: String,
        required: true,
      },
      cost: {
        type: Number,
        required: true,
      },
      rarity: {
        type: String,
        enum: ['common', 'rare', 'epic', 'legendary'],
        default: 'common',
      },
      type: String,
      attack: Number,
      health: Number,
      description: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      createdAt: Date,
      updatedAt: Date,
      // TODO: Add relations to mongo schema
      // packIds: [Number],
      // userIds: [Number],
    });

    static associate() {
      this.belongsToMany(User, { through: User_Card, foreignKey: 'cardId' });
      this.belongsToMany(Pack, { through: Pack_Card, foreignKey: 'cardId' });
    }
  }

  Card.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      cost: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      /**
       * The rarity of the card. Can be one of the following:
       * - `common`
       * - `rare`
       * - `epic`
       * - `legendary`
       */
      rarity: {
        type: DataTypes.ENUM('common', 'rare', 'epic', 'legendary'),
        allowNull: false,
        defaultValue: 'common',
      },
      type: DataTypes.STRING,
      attack: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      health: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      }
    },
    {
      sequelize: connection,
      tableName: 'cards',
      defaultScope: {
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      scopes: {
        withTimestamps: {
          attributes: { include: ['createdAt', 'updatedAt'] },
        },
      },
    }
  );
  return Card;
};
