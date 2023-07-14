import { DataTypes, Model } from 'sequelize';

/**
 * @param {import('sequelize').Sequelize} connection
 */

export default (connection) => {
  class Product extends Model {
    static associate() {}
  }

  Product.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      categorie: {
        type: DataTypes.ENUM('COINS'),
        allowNull: false,
        defaultValue: 'COINS',
        validate: {
          notEmpty: true,
        },
      },
      value: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize: connection,
      modelName: 'product',
      defaultScope: {
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      scopes: {
        withTimestamps: {
          attributes: { include: ['createdAt', 'updatedAt'] },
        },
      },
    },
  );

  return Product;
};
