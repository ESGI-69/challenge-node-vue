import { User } from './../db/index.js';

export default {
  /**
   * Find a user by email and return it with its password
   * @param {import('sequelize').WhereOptions} criteria
   * @returns
   */
  findLogin: function (criteria) {
    return User.scope('withPassword', 'withoutEmailToken').findOne({
      where: criteria,
    });
  },
  /**
   * Find all users matching the criteria
   * @param {import('sequelize').WhereOptions} criteria
   * @param {import('sequelize').FindOptions} options
   * @returns
   */
  findAll: function (criteria, options = {}) {
    return User.findAll({
      where: criteria,
      ...options,
      order: Object.entries(options.order || {}),
    });
  },
  findByIdAvatar: function (id) {
    return User.scope('withAvatar', 'withoutEmailToken').findByPk(id);
  },
  findById: function (id) {
    return User.findByPk(id);
  },
  create: async function (data) {
    const user = await User.create(data);
    return this.findById(user.id);
  },
  update: async function (criteria, data) {
    const [, users = []] = await User.update(data, {
      where: criteria,
      returning: true,
      individualHooks: true, // to trigger the encryption hook on update (see user model)
    });
    return this.findById(users[0].id);
  },
  validate: function (data) {
    return User.build(data).validate();
  },
  remove: function (criteria) {
    return User.destroy({
      where: criteria,
    });
  },
  /**
   *
   * @param {import('../db/index.js').User} userModel
   */
  getCards: function (userModel) {
    return userModel.getCards();
  },
  /**
   * Check if the user has the card
   */
  hasCard: function (userModel, cardId) {
    return userModel.hasCard(cardId);
  },
  /**
   *
   * @param {import('../db/index.js').User} userModel
   * @param {number} cardId
   * @returns
   */
  addCard: function (userModel, cardId) {
    return userModel.addCard(cardId);
  },
  /**
   * Add money to the user
   * @param {import('../db/index.js').User} userModel
   * @param {number} amount
   */
  addMoney: function (userModel, amount) {
    return userModel.increment('balance', { by: amount });
  },
  /**
   * Remove money from the user
   * @param {import('../db/index.js').User} userModel
   * @param {number} amount
   */
  removeMoney: function (userModel, amount) {
    return userModel.decrement('balance', { by: amount });
  },
  /**
   * Confirm the user email
   * @param {import('../db/index.js').User} userModel
   * @param {import('sequelize').WhereOptions} emailToken
   */
  confirm: async function (emailToken) {
    const user = await User.scope('withEmailToken').findOne({
      where: {
        mailToken: emailToken,
      },
    });
    if (!user) throw new Error('User not found', { cause: 'Not Found' });
    await user.update({
      mailToken: null,
    });
  },
};
