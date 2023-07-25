import { DataTypes, Model } from 'sequelize';
import { Product, User } from '../index.js';

export default (connection) => {
  class Payment extends Model {
    static associate() {
      this.belongsTo(User, { through: User, foreignKey: 'userId', as: 'user' });
      this.belongsTo(Product, { through: Product, foreignKey: 'productId', as: 'product' });
    }
  }

  Payment.init(
    {
      status: {
        type: DataTypes.ENUM('PENDING', 'PAID', 'CANCELED'),
        allowNull: false,
        defaultValue: 'PENDING',
      },
      isCredited: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      sessionId: DataTypes.STRING,
      checkoutUrl: DataTypes.TEXT,
    },
    {
      sequelize: connection,
      tableName: 'payments',
      defaultScope: {
        attributes: { exclude: ['sessionId'] },
      },
      scopes: {
        withSessionId: {
          attributes: { include: ['sessionId'] },
        },
      },
    },
  );

  return Payment;
};
