import { DataTypes, Model } from 'sequelize';

/**
 * @param {import('sequelize').Sequelize} connection
 */

export default (connection) => {
  class User_Card extends Model {

  }

  User_Card.init(
    {
      obtainedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
      sequelize: connection,
      tableName: 'user_cards',
    },
  );
  return User_Card;
};
