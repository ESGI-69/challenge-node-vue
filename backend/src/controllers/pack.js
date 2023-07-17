import packService from '../services/pack.js';
import userService from '../services/user.js';

export default {
  /**
   * Express.js controller for POST /packs/
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  findAll: async (req, res, next) => {
    try {
      const packs = await packService.findAll({
        userId: req.user.id,
      });
      res.json(packs);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller for POST /packs/buy
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  buy: async (req, res, next) => {
    try {
      const pack = await packService.create(req.user);

      // Remove the cost of the pack from the user's balance
      await userService.removeMoney(req.user, 100);

      // Send the pack to the user
      res.status(201).json({ pack, cost: 100 });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },

  /**
   * Express.js controller for POST /packs/:id/open
   *
   * Open a pack. This will add the cards to the user's collection. If the user already has the card, it will not be added to the collection and will be returned in the response.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  open: async function (req, res, next) {
    try {
      const pack = await packService.findById(req.params.id);
      if (!pack) return res.status(404).json({ message: 'No pack found', code: 'pack_not_found' });
      if (pack.userId !== req.user.id) throw new Error('You are not the owner of this pack', { cause: 'Unauthorized' });
      if (pack.isOpened()) return res.status(403).json({ message: 'Pack already opened', code: 'pack_already_opened' });
      /**
       * Array of cards that are in the pack
       */
      const cards = await packService.open(pack);

      const userCards = await req.user.getCards();

      const duplicateCards = cards.filter((card) => userCards.some((userCard) => userCard.id === card.id));
      /**
       * Array of card IDs that are already in the user's collection
       * @type {number[]}
       */
      const duplicateCardIds = duplicateCards.map((card) => card.id);

      const refunded = duplicateCards.reduce((acc, card) => {
        if (card.rarity === 'common') return acc + 10;
        if (card.rarity === 'rare') return acc + 20;
        if (card.rarity === 'epic') return acc + 50;
        return acc + 100; // legendary
      }, 0);

      // Add the value of the duplicate cards to the user's balance
      await userService.addMoney(req.user, refunded);

      /**
       * Array of card IDs that are in the pack but not in the user's collection
       */
      const cardIds = cards.map((card) => card.id).filter((cardId) => !duplicateCardIds.includes(cardId));
      await req.user.addCards(cardIds);
      res.status(200).json({ cards, duplicateCardIds, refunded });
    } catch (err) {
      next(err);
    }
  },
};

