import { DataTypes, Model } from 'sequelize';

import { Deck, Deck_Card, Pack, Pack_Card, User, User_Card } from '../index.js';

/**
 * @param {import('sequelize').Sequelize} connection
 */

export default (connection) => {
  class Card extends Model {
    static associate() {
      this.belongsToMany(User, { through: User_Card, foreignKey: 'cardId' });
      this.belongsToMany(Pack, { through: Pack_Card, foreignKey: 'cardId' });
      this.belongsToMany(Deck, { through: Deck_Card, foreignKey: 'cardId' });
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

  Card.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      cost: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
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
        allowNull: false,
        defaultValue: 0,
      },
      health: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize: connection,
      tableName: 'cards',
      defaultScope: {
        attributes: { exclude: ['createdAt', 'updatedAt', 'image'] },
      },
      scopes: {
        withTimestamps: {
          attributes: { include: ['createdAt', 'updatedAt'], exclude: ['image'] },
        },
      },
    },
  );

  // Adding scope after class declaration for accesing attributes
  Card.addScope('onlyImage', {
    attributes: { include: ['image'], exclude: Object.keys(Card.getAttributes()) },
  });

  return Card;
};
