import { Op } from 'sequelize';
import { Card, Deck } from '../db/index.js';

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
  /**
   * Find all decks associated with a specific user ID
   * @param {number} userId
   * @param {import('sequelize').FindOptions} options
   * @returns {Promise<Deck[]>}
   */
  findByIdUser: function (userId, options = {}) {
    return Deck.findAll({ ...options, where: { userId } });
  },
  /**
   * Find all decks associated with a specific user ID and a given name
   * @param {number} userId
   * @param {import('sequelize').FindOptions} options
   * @returns {Promise<Deck[]>}
   */
  findNameAndByIdUser: function (userId, name, options = {}) {
    let where = {};

    if (name) {
      where.name = { [Op.like]: `${name}%` };
    }

    where.userId = userId;
    return Deck.findAll({ ...options, where: where });
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
    return deckModel.getCards({
      raw: true,
      nest: true,
    });
  },
  /**
   * @param {import('../db/index.js').Deck} deckModel
   * @param {number} cardId
   * @returns
   * */
  removeCard: function (deckModel, cardId) {
    return deckModel.removeCard(cardId);
  },
  /**
   * @param {import('../db/index.js').Deck} deckModel
   * @param {number} cardId
   * @returns
   * */
  hasCard: function (deckModel, cardId) {
    return deckModel.hasCard(cardId);
  },
  /**
   * @param {import('../db/index.js').Deck} deckModel
   * @param {number} cardId
   * @returns
   * */
  countCard: async (id) => {
    const deck = await Deck.findByPk(id, {
      include: Card,
    });
    return deck.Cards.length;
  },
  /**
   * @param {import('../db/index.js').Deck} deckModel
   * @param {number} cardId
   * @returns
   * */
  isValid: async (id) => {
    const deck = await Deck.findByPk(id, {
      include: Card,
    });
    return (deck.Cards.length === 5);
  },
  /**
   * @param {import('../db/index.js').Deck} deckModel
   * @param {number} idUser
   * @returns
   * */
  getValids: async (idUser) => {
    const decks = await Deck.findAll({
      where: {
        userId: idUser,
      },
      include: Card,
    });

    const valids = decks.filter((deck) => {
      return (deck.Cards.length == 5);
    });

    return valids;
  },
};
