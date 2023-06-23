import { DataTypes, Model } from 'sequelize';
import { Card, Pack_Card, User } from '../index.js';

/**
 * @param {import('sequelize').Sequelize} connection
 * @param {import('mongoose').Mongoose} mongoose
 */

export default (connection, mongoose) => {
  class Pack extends Model {
    static mongoSchema = new mongoose.Schema({
      id: {
        type: Number,
        required: true,
        unique: true,
      },
      openedAt: Date,
      createdAt: Date,
    });

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
