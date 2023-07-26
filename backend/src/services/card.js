import { Op } from 'sequelize';
import { Card, connection } from '../db/index.js';

export default {
  count: function (options = {}) {
    return Card.count(options);
  },
  /**
   * Find all cards matching the given criteria
   * @param {import('sequelize').FindOptions} options
   * @param {boolean} formated If true, return an object with count, nextOffset and data properties instead of just the data
   * @returns {Promise<{count: number, nextOffset: number, data: Card[]}>}
   */
  findAll: function (options = {}) {
    return Card.findAll(options);
  },
  findById: function (id, options = {}) {
    return Card.findByPk(id, options);
  },
  /**
   * Find a card by its ID, including timestamps
   */
  findByIdAdmin: function (id) {
    return Card.scope('withTimestamps').findByPk(id);
  },
  findByIdImage: function (id) {
    return Card.scope('onlyImage').findByPk(id);
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
    console.log('service criteria', criteria);
    console.log('service data', data);
    console.log('service', cards);
    return cards;
  },
  validate: function (data) {
    return Card.build(data).validate();
  },
  remove: function (criteria) {
    return Card.destroy({
      where: criteria,
    });
  },
};
