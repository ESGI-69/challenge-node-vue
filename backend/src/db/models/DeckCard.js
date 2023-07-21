import { Model } from 'sequelize';

/**
 * @param {import('sequelize').Sequelize} connection
 */

export default (connection) => {
  class Deck_Card extends Model {

  }

  Deck_Card.init(
    {},
    {
      timestamps: false,
      sequelize: connection,
      tableName: 'deck_cards',
    },
  );
  return Deck_Card;
};
