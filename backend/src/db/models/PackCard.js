import { Model } from 'sequelize';

/**
 * @param {import('sequelize').Sequelize} connection
 */

export default (connection) => {
  class Pack_Card extends Model {

  }

  Pack_Card.init(
    {},
    {
      timestamps: false,
      sequelize: connection,
      tableName: 'pack_cards',
    },
  );
  return Pack_Card;
};
