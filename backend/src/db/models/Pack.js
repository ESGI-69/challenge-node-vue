import { DataTypes, Model } from 'sequelize';
import { Card, User } from '../index.js';

/**
 * @param {import('sequelize').Sequelize} connection
 */

export default (connection) => {
  class Pack extends Model {
    static associate() {
      this.belongsTo(User, { foreignKey: 'userId' });
      this.belongsToMany(Card, { through: 'pack_cards', foreignKey: 'packId', as: 'cards' });
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

  Pack.addHook('beforeUpdate', (pack) => {
    // Pack canot be updated if it has already been opened
    if (pack.openedAt !== null) {
      throw new Error('Pack already opened');
    }

    // Pack canot be updated for other thinks than openedAt
    if (pack.changed().length !== 1 || !pack.changed().includes('openedAt')) {
      throw new Error('Pack is not updatable');
    }
  });

  return Pack;
};
