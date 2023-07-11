import { Pack } from '../db/index.js';
import cardService from './card.js';

export default {
  /**
   * Find all packs matching the criteria
   * @param {import('sequelize').WhereOptions} criteria
   * @param {import('sequelize').FindOptions} options
   * @returns
   */
  findAll: function (criteria, options = {}) {
    return Pack.findAll({
      where: criteria,
      ...options,
      order: Object.entries(options.order || {}),
    });
  },
  findById: function (id) {
    return Pack.findByPk(id);
  },
  /**
   *
   * @param {typeof import('../db/index.js').User} userModel
   */
  create: async (userModel) => {
    const dropRates = {
      rare: 0.3,
      epic: 0.2,
      legendary: 0.01,
    };

    // Generate 5 cards
    const packCards = [];
    for (let i = 0; i < 5; i++) {
      // Generate a random number between 0 and 1
      const random = Math.random();
      if (random < dropRates.legendary) {
        // Generate a legendary card
        const card = await cardService.findRandom('legendary', packCards);
        if (!card) throw new Error('No card found');
        packCards.push(card?.id);
      } else if (random < dropRates.epic) {
        // Generate an epic card
        const card = await cardService.findRandom('epic', packCards);
        if (!card) throw new Error('No card found');
        packCards.push(card?.id);
      } else if (random < dropRates.rare) {
        // Generate a rare card
        const card = await cardService.findRandom('rare', packCards);
        if (!card) throw new Error('No card found');
        packCards.push(card?.id);
      } else {
        // Generate a common card
        const card = await cardService.findRandom('common', packCards);
        if (!card) throw new Error('No card found');
        packCards.push(card?.id);
      }
    }

    // Create the pack
    const pack = await Pack.create({
      userId: userModel.id,
    });

    // Add the cards to the pack
    await pack.addCard(packCards);

    return pack;
  },
  /**
   * Open a pack
   * @param {typeof import('../db/index.js').Pack} packModel
   */
  open: async (packModel) => {
    const cards = await packModel.getCards({
      raw: true,
      nest: true,
    });
    await packModel.update({ id: packModel.id }, {
      openedAt: new Date(),
    });
    cards.forEach((card) => {
      delete card['pack_cards'];
    });
    return cards;
  },
};
