import { Product } from './../db/index.js';

export default {
  /**
   * Find all products matching the criteria
   * @param {import('sequelize').WhereOptions} criteria
   * @param {import('sequelize').FindOptions} options
   * @returns
   */
  findAll: function (criteria, options = {}) {
    return Product.findAll({
      where: criteria,
      ...options,
      order: Object.entries(options.order || {}),
    });
  },

  /**
   * Find a product by id
   * @param {string} id
   * @returns
   */
  findById: function (id) {
    return Product.findByPk(id);
  },

  /**
   * Create a product
   * @param {object} data
   * @returns
   */
  create: async function (data) {
    const product = await Product.create(data);
    return this.findById(product.id);
  },

  /**
   * Update a product
   * @param {import('sequelize').WhereOptions} criteria
   * @param {object} data
   * @returns
   */
  update: async function (criteria, data) {
    const [, products = []] = await Product.update(data, {
      where: criteria,
      returning: true,
    });
    if (!products.length) throw new Error('Product not found', { cause: 'Not Found' });
    return this.findById(products[0].id);
  },

  /**
   * Delete a product
   * @param {import('sequelize').WhereOptions} criteria
   * @returns
   */
  remove: function (criteria) {
    return Product.destroy({
      where: criteria,
    });
  },
};
