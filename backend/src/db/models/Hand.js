import { Model } from 'sequelize';

import { Card, Game, Hand_Card, User } from '../index.js';

/**
 * @param {import('sequelize').Sequelize} connection
 */

export default (connection) => {
  class Hand extends Model {
    static associate() {
      Hand.belongsTo(Game, { through: Game, foreignKey: 'game_id', as: 'game' });
      Hand.belongsTo(User, { through: User, foreignKey: 'user_id', as: 'user' });
      Hand.belongsToMany(Card, { through: Hand_Card, as: 'cards' });
    }
  }

  Hand.init(
    {},
    {
      sequelize: connection,
      tableName: 'hands',
      timestamps: false,
    },
  );

  return Hand;
};
