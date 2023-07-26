import { Board_CardInstance, CardInstance, Game, User } from '../index.js';
import { Model } from 'sequelize';

/**
 * @param {import('sequelize').Sequelize} connection
 */

export default (connection) => {
  class Board extends Model {
    static associate() {
      Board.belongsTo(Game, {
        foreignKey: 'game_id',
      });
      Board.belongsTo(User, {
        foreignKey: 'user_id',
      });
      Board.belongsToMany(CardInstance, { through: Board_CardInstance, as: 'cardInstances' });
    }
  }

  Board.init(
    {},
    {
      timestamps: false,
      sequelize: connection,
      tableName: 'boards',
    },
  );
  return Board;
};
