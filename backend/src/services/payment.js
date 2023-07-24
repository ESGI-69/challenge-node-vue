import { Payment } from './../db/index.js';

export default {
  /**
   * Find all payments matching the criteria
   * @param {import('sequelize').WhereOptions} criteria
   * @param {import('sequelize').FindOptions} options
   * @returns
   */
  findAll: function (criteria, options = {}) {
    return Payment.findAll({
      where: criteria,
      ...options,
      order: Object.entries(options.order || {}),
    });
  },

  /**
   * Create a payment
   * @param {object} data
   * @returns
   */
  create: async function (data) {
    return this.findById((await Payment.create(data)).id);
  },

  /**
   * Find a payment by id
   * @param {string} id
   * @returns
   */
  findById: function (id) {
    return Payment.findByPk(id);
  },

  /**
   * Find a payment by id with session id
   * @param {string} id
   * @returns
   */
  findByIdWithSessionId: function (id) {
    return Payment.scope('withSessionId').findByPk(id);
  },

  /**
   * Update a payment
   * @param {import('sequelize').WhereOptions} criteria
   * @param {object} data
   * @returns
   */
  update: async function (criteria, data) {
    const [, payments = []] = await Payment.update(data, {
      where: criteria,
      returning: true,
    });
    if (!payments.length) throw new Error('Payment not found', { cause: 'Not Found' });
    return this.findById(payments[0].id);
  },

  /**
   * Find all payments matching the criteria with session id
   */
  findAllWithSessionId: function (criteria, options = {}) {
    return Payment.scope('withSessionId').findAll({
      where: criteria,
      ...options,
      order: Object.entries(options.order || {}),
    });
  },
};
