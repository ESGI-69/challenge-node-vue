import { DataTypes, Model } from 'sequelize';
import { Product, User } from '../index.js';

export default (connection) => {
  class Payment extends Model {
    static associate() {
      this.belongsTo(User, { foreignKey: 'userId' });
      this.belongsTo(Product, { foreignKey: 'productId' });
    }
  }

  Payment.init(
    {
      status: {
        type: DataTypes.ENUM('PENDING', 'PAID', 'CANCELED'),
        allowNull: false,
        defaultValue: 'PENDING',
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
