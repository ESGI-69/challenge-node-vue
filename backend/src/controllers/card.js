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
    const {
      _page = 1,
      _itemsPerPage = 40,
      _sort = {},
      ...criteria
    } = req.query;
    try {
      const cards = await cardService.findAll(criteria, {
        offset: (_page - 1) * _itemsPerPage,
        limit: _itemsPerPage,
        order: _sort,
      });
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
      res.status(201).json(card);
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
   * Express.js controller for PUT /cards/:id
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  put: async (req, res, next) => {
    try {
      const nbRemoved = await cardService.remove({
        id: parseInt(req.params.id),
      });
      const card = await cardService.create({
        id: parseInt(req.params.id),
        ...req.body,
      });
      res.status(nbRemoved ? 200 : 201).json(card);
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
        req.body
      );
      if (!card) return res.sendStatus(404);
      res.json(card);
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

