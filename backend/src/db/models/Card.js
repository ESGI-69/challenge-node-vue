import { Model, DataTypes } from 'sequelize';

/**
 * @param {import('sequelize').Sequelize} connection
 */

export default (connection) => {
  class Card extends Model {

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
    }
  );
  return Card;
};
