import { Model } from 'sequelize';

/**
 * @param {import('sequelize').Sequelize} connection
 */

export default (connection) => {
  class User_Cards extends Model {

  }

  User_Cards.init(
    {},
    {
      timestamps: false,
      sequelize: connection,
      tableName: 'user_cards',
    }
  );
  return User_Cards;
};
