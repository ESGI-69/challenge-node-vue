import { Model } from 'sequelize';

/**
 * @param {import('sequelize').Sequelize} connection
 */

export default (connection) => {
  class Board_CardInstance extends Model {
  }

  Board_CardInstance.init(
    {},
    {
      timestamps: false,
      sequelize: connection,
      tableName: 'board_card_instances',
    },
  );
  return Board_CardInstance;
};
