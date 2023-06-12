import { Model } from 'sequelize';

/**
 * @param {import('sequelize').Sequelize} connection
 */

export default (connection) => {
  class User_Card extends Model {

  }

  User_Card.init(
    {},
    {
      timestamps: false,
      sequelize: connection,
      tableName: 'user_cards',
    }
  );
  return User_Card;
};
