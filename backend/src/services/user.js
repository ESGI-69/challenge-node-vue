import { User } from './../db/index.js';

export default {
  findAll: function (criteria, options = {}) {
    return User.findAll({
      where: criteria,
      ...options,
      order: Object.entries(options.order || {}),
    });
  },
  findById: function (id) {
    return User.findByPk(id);
  },
  create: function (data) {
    return User.create(data);
  },
  update: async function (criteria, data) {
    const [, users = []] = await User.update(data, {
      where: criteria,
      returning: true,
      individualHooks: true, // to trigger the encryption hook on update (see user model)
    });
    return users;
  },
  remove: function (criteria) {
    return User.destroy({
      where: criteria,
    });
  },
};
