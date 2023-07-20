import { Deck } from '../db/index.js';

export default {
  count: function (options = {}) {
    return Deck.count(options);
  },
  /**
   * Find all decks matching the given criteria
   * @param {import('sequelize').FindOptions} options
   * @param {boolean} formated If true, return an object with count, nextOffset and data properties instead of just the data
   * @returns {Promise<{count: number, nextOffset: number, data: Deck[]}>}
   */
  findAll: function (options = {}) {
    return Deck.findAll(options);
  },
  findById: function (id, options = {}) {
    return Deck.findByPk(id, options);
  },
  create: function (data) {
    return Deck.create(data);
  },
  update: async function (criteria, data) {
    const [, decks = []] = await Deck.update(data, {
      where: criteria,
      returning: true,
    });
    return decks;
  },
  validate: function (data) {
    return Deck.build(data).validate();
  },
  remove: function (criteria) {
    return Deck.destroy({
      where: criteria,
    });
  },
  /**
   *
   * @param {import('../db/index.js').Deck} deckModel
   * @param {number} cardId
   * @returns
   */
  addCard: async (deckModel, cardId) => {
    await deckModel.addCard(cardId);
    const cards = await deckModel.getCards({
      raw: true,
      nest: true,
    });
    return cards;
  },
  /**
   * @param {import('../db/index.js').Deck} deckModel
   * @param {number} cardId
   * @returns
   * */
  removeCard: async (deckModel, cardId) => {
    const removeCard = await deckModel.removeCard(cardId);
    return removeCard;
  },
};
