import { Op } from 'sequelize';
import { Card, connection } from '../db/index.js';

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
  /**
   * Find a random card with the given rarity and excluding the given IDs
   * @param {'common' | 'rare' | 'epic' | 'legendary'} rarity The rarity of the card to find
   * @param {number[]} exclude An array of card IDs to exclude from the search
   * @returns {Promise<Card>}
   */
  findRandom: function (rarity, exclude = []) {
    return Card.findOne({
      order: connection.random(),
      where: {
        rarity,
        id: {
          [Op.notIn]: exclude,
        },
      },
    });
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
  validate: function (data) {
    return Card.build(data).validate();
  },
  remove: function (criteria) {
    return Card.destroy({
      where: criteria,
    });
  }
};
