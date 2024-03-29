import productService from '../services/product.js';

export default {
  /**
   * Express.js controller GET /product
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  async cget(req, res, next) {
    try {
      res.json(await productService.findAll());
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller POST /product
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  async post(req, res, next) {
    try {
      const { name, price, categorie, value } = req.body;
      const product = await productService.create({
        name,
        price,
        categorie,
        value,
      });
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller GET /product/:id
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  async get(req, res, next) {
    try {
      res.json(await productService.findById(req.params.id));
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller PATCH /product/:id
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  async patch(req, res, next) {
    try {
      const product = await productService.update(
        { id: parseInt(req.params.id) },
        req.body,
      );
      res.json(product);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller DELETE /product/:id
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  async delete(req, res, next) {
    try {
      await productService.remove({ id: parseInt(req.params.id) });
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },
};
