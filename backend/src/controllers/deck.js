import deckService from '../services/deck.js';

export default {
  /**
     * Expresse.js controller for GET /decks
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {Promise<void>}
     */
  cget: async (req, res, next) => {
    try {
      const decks = await deckService.findAll();
      res.json(decks);
    } catch (err) {
      next(err);
    }
  },
  /**
       * Express.js controller for POST /deck
       * @param {import('express').Request} req
       * @param {import('express').Response} res
       * @param {import('express').NextFunction} next
       * @returns {Promise<void>}
       */
  post: async (req, res, next) => {
    try {
      const deck = await deckService.create({
        name: req.body.name,
        userId: req.user.id,
      });
      const createdDeck = await deckService.findById(deck.id);
      res.status(201).json(createdDeck);
    } catch (err) {
      next(err);
    }
  },
  /**
       * Express.js controller for GET /decks/:id
       * @param {import('express').Request} req
       * @param {import('express').Response} res
       * @param {import('express').NextFunction} next
       * @returns {Promise<void>}
       * */
  get: async (req, res, next) => {
    try {
      const deck = await deckService.findById(parseInt(req.params.id));
      if (!deck) return res.sendStatus(404);
      res.json(deck);
    } catch (err) {
      next(err);
    }
  },
  /**
       * Express.js controller for DELETE /decks/:id
       * @param {import('express').Request} req
       * @param {import('express').Response} res
       * @param {import('express').NextFunction} next
       * @returns {Promise<void>}
       */
  patch : async (req, res, next) => {
    try {
      const [deck] = await deckService.update(
        { id: parseInt(req.params.id) },
        req.body,
      );
      if (!deck) return res.sendStatus(404);
      const updatedDeck = await deckService.findByIdAdmin(deck.id);
      res.json(updatedDeck);
    } catch (err) {
      next(err);
    }
  },
  /**
       * Express.js controller for DELETE /decks/:id
       * @param {import('express').Request} req
       * @param {import('express').Response} res
       * @param {import('express').NextFunction} next
       * @returns {Promise<void>}
       */
  delete: async (req, res, next) => {
    try {
      const nbRemoved = await deckService.remove({
        id: parseInt(req.params.id),
      });
      res.sendStatus(nbRemoved ? 204 : 404);
    } catch (err) {
      next(err);
    }
  },
};
