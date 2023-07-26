import cardService from '../services/card.js';

export default {
/**
 * Expresse.js controller for GET /cards
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
  cget: async (req, res, next) => {
    try {
      const cards = await cardService.findAll();
      res.json(cards);
    } catch (err) {
      next(err);
    }
  },
  /**
   * Express.js controller for POST /cards
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  post: async (req, res, next) => {
    try {
      const card = await cardService.create(req.body);
      const createdCard = await cardService.findByIdAdmin(card.id);
      res.status(201).json(createdCard);
    } catch (err) {
      next(err);
    }
  },
  /**
   * Express.js controller for GET /cards/:id
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   * */
  get: async (req, res, next) => {
    try {
      const card = await cardService.findById(parseInt(req.params.id));
      if (!card) return res.sendStatus(404);
      res.json(card);
    } catch (err) {
      next(err);
    }
  },
  /**
   * Express.js controller for GET /cards/:id/image
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   * */
  getImage: async (req, res, next) => {
    try {
      const card = await cardService.findByIdImage(parseInt(req.params.id));
      if (!card) return res.sendStatus(404);
      res.sendFile(card.image, {
        root: 'public/card-images',
      });
    } catch (err) {
      next(err);
    }
  },
  /**
   * Express.js controller for DELETE /cards/:id
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  patch : async (req, res, next) => {
    try {
      const [card] = await cardService.update(
        { id: parseInt(req.params.id) },
        req.body,
      );
      console.log('card', card);
      console.log('req.body', req.body);
      console.log('id', parseInt(req.params.id));
      if (!card) return res.sendStatus(404);
      const updatedCard = await cardService.findByIdAdmin(card.id);
      res.json(updatedCard);
    } catch (err) {
      next(err);
    }
  },
  /**
   * Express.js controller for DELETE /cards/:id
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  delete: async (req, res, next) => {
    try {
      const nbRemoved = await cardService.remove({
        id: parseInt(req.params.id),
      });
      res.sendStatus(nbRemoved ? 204 : 404);
    } catch (err) {
      next(err);
    }
  },
};

