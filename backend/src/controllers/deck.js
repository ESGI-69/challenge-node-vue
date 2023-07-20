import deckService from '../services/deck.js';
import userService from '../services/user.js';
import cardService from '../services/card.js';

import { Card } from '../db/index.js';

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
      const deck = await deckService.findById(parseInt(req.params.id), {
        include: Card,
      });
      if (!deck) return res.sendStatus(404);

      res.json(deck);
    } catch (err) {
      next(err);
    }
  },
  /**
   * Express.js controller for patch /decks/:id
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
      const updatedDeck = await deckService.findById(deck.id);
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
  /**
   * Express.js controller for POST /decks/:id/cards
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   * */
  addCard: async (req, res, next) => {
    try {
      const deck = await deckService.findById(parseInt(req.params.id), {
        include: Card,
      });
      if (!deck) return res.sendStatus(404);
      if (!req.user) return res.sendStatus(401);
      if (req.user.id !== deck.userId) return res.sendStatus(403);
      const user = await userService.findById(req.user.id);
      const cards = await user.getCards();
      const card = await cardService.findById(parseInt(req.body.cardId));
      if (!card) return res.sendStatus(404);

      let isOwned = false;

      for (let i = 0; i < cards.length; i++) {
        if (cards[i].id === card.id) {
          isOwned = true;
          break;
        }
      }
      if (!isOwned) return res.sendStatus(403);

      await deckService.addCard(deck, parseInt(req.body.cardId));
      const updatedDeck = await deckService.findById(deck.id, {
        include: Card,
      });
      res.json(updatedDeck);

    } catch (err) {
      next(err);
    }
  },
  /**
   * Express.js controller for DELETE /decks/:id/cards/
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   * */
  removeCard: async (req, res, next) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const deck = await deckService.findById(parseInt(req.params.id));
      if (!deck) return res.sendStatus(404);
      if (req.user.id !== deck.userId) return res.sendStatus(403);
      const user = await userService.findById(req.user.id);
      const cards = await user.getCards();
      const card = await cardService.findById(parseInt(req.body.cardId));
      if (!card) return res.sendStatus(404);

      let isOwned = false;

      for (let i = 0; i < cards.length; i++) {
        if (cards[i].id === card.id) {
          isOwned = true;
          break;
        }
      }
      if (!isOwned) return res.sendStatus(403);

      await deckService.removeCard(deck, parseInt(req.body.cardId));
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  },
};
