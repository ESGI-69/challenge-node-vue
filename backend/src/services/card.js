import { Card } from '../db/index.js';

export default {
  findAll: function (criteria, options = {}) {
    return Card.findAll({
      where: criteria,
      ...options,
      order: Object.entries(options.order || {}),
    });
  },
  findById: function (id) {
    return Card.findByPk(id);
  },
  create: function (data) {
    return Card.create(data);
  },
  update: async function (criteria, data) {
    const [, cards = []] = await Card.update(data, {
      where: criteria,
      returning: true,
    });
    return cards;
  },
  remove: function (criteria) {
    return Card.destroy({
      where: criteria,
    });
  }
};
