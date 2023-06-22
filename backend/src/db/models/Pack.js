import { DataTypes, Model } from 'sequelize';
import { Card, Pack_Card, User } from '../index.js';

/**
 * @param {import('sequelize').Sequelize} connection
 */

export default (connection) => {
  class Pack extends Model {
    static associate() {
      this.belongsTo(User, { foreignKey: 'userId' });
      this.belongsToMany(Card, { through: Pack_Card, foreignKey: 'packId' });
    }

    isOpened() {
      return this.openedAt !== null;
    }
  }

  Pack.init(
    {
      openedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      updatedAt: false,
      sequelize: connection,
      tableName: 'packs',
    }
  );

  return Pack;
};
