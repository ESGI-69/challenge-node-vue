import { Card } from '../db/index.js';

export default {
  findAll: function (criteria, options = {}) {
    console.log(Card);
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
    const [nb, cards = []] = await Card.update(data, {
      where: criteria,
      returning: true,
    });
    console.log(nb, cards);
    return cards;
  },
  remove: function (criteria) {
    return Card.destroy({
      where: criteria,
    });
  }
};
