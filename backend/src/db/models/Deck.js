import { DataTypes, Model } from 'sequelize';

// import { Card, Deck_Card, User } from '../index.js';
import { User } from '../index.js';

/**
 * @param {import('sequelize').Sequelize} connection
 */

export default (connection) => {
  class Deck extends Model {
    static associate() {
      this.belongsTo(User, { through: User, foreignKey: 'userId' });
      // this.hasMany(Card, { through: Deck_Card, foreignKey: 'cardId' });
    }
  }

  Deck.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize: connection,
      tableName: 'decks',
      defaultScope: {
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      scopes: {
        withTimestamps: {
          attributes: { include: ['createdAt', 'updatedAt'] },
        },
      },
    },
  );

  return Deck;
};
