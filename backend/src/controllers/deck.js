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
      res.json(await deckService.findAll());
    } catch (err) {
      next(err);
    }
  },
  /**
   * Express.js controller for POST /decks
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
      res.status(201).json(deck);
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
      if (!deck) throw new Error('Deck not found', { cause: 'Not Found' });

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
      const deck = await deckService.findById(parseInt(req.params.id));
      if (!deck) throw new Error('Deck not found', { cause: 'Not Found' });
      if (req.user.id !== deck.userId) throw new Error('You don\'t own this deck', { cause: 'Unauthorized' });

      await deck.update(
        {
          id: parseInt(req.params.id),
          name: req.body.name,
        },
      );
      res.json(await deckService.findById(deck.id));
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
      const deck = await deckService.findById(parseInt(req.params.id));

      if (!deck) throw new Error('Deck not found', { cause: 'Not Found' });
      if (req.user.id !== deck.userId) throw new Error('You don\'t own this deck', { cause: 'Unauthorized' });

      if (req.user.idDeckFav === deck.id) {

        await userService.update(
          { id: parseInt(req.user.id) },
          {
            id: req.user.id,
            idDeckFav: null,
          },
        );
      }

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
      if (!deck) throw new Error('Deck not found', { cause: 'Not Found' });
      if (req.user.id !== deck.userId) throw new Error('You don\'t own this deck', { cause: 'Unauthorized' });
      const card = await cardService.findById(parseInt(req.body.cardId));
      if (!card) throw new Error('Card not found', { cause: 'Not Found' });

      if (!await userService.hasCard(req.user, req.body.cardId)) throw new Error('You don\'t have this card', { cause: 'Unauthorized' });

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
      const deck = await deckService.findById(parseInt(req.params.id));
      if (!deck) throw new Error('Deck not found', { cause: 'Not Found' });
      if (req.user.id !== deck.userId) throw new Error('You don\'t own this deck', { cause: 'Unauthorized' });
      const card = await cardService.findById(parseInt(req.body.cardId));
      if (!card) throw new Error('Card not found', { cause: 'Not Found' });

      if (!await userService.hasCard(req.user, req.body.cardId)) throw new Error('You don\'t have this card', { cause: 'Unauthorized' });
      if (!await deckService.hasCard(deck, req.body.cardId)) throw new Error('This card is not in this deck', { cause: 'Unauthorized' });

      await deckService.removeCard(deck, parseInt(req.body.cardId));
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  },
};
