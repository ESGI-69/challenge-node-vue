/**
 * User service
 * @type {typeof require('./../db/models/user.js')}
**/
import { User } from './../db/index.js';

export default {
  findAll: async function (criteria, options = {}) {
    console.log(User);
    return User.findAll({
      where: criteria,
      ...options,
      order: Object.entries(options.order || {}),
    });
  },
  findById: async function (id) {
    return User.findByPk(id);
  },
  create: async function (data) {
    return User.create(data);
  },
  update: async function (criteria, data) {
    const [nb, users = []] = await User.update(data, {
      where: criteria,
      returning: true,
      individualHooks: true, // to trigger the encryption hook on update (see user model)
    });
    console.log(nb, users);
    return users;
  },
  remove: async function (criteria) {
    return User.destroy({
      where: criteria,
    });
  },
};
