import { Model } from 'sequelize';

/**
 * @param {import('sequelize').Sequelize} connection
 */

export default (connection) => {
  class Hand_Card extends Model {

  }

  Hand_Card.init(
    {},
    {
      timestamps: false,
      sequelize: connection,
      tableName: 'hand_cards',
    },
  );
  return Hand_Card;
};
