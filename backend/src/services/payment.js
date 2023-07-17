import { Payment } from './../db/index.js';

export default {
  /**
   * Create a payment
   * @param {object} data
   * @returns
   */
  create: async function (data) {
    const payment = await Payment.create(data);
    return this.findById(payment.id);
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
};
