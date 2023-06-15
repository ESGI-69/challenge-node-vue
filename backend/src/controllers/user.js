import userService from '../services/user.js';

export default {
  /**
   * Express.js controller for GET /users
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  cget: async (req, res, next) => {
    const {
      _page = 1,
      _itemsPerPage = 10,
      _sort = {},
      ...criteria
    } = req.query;
    try {
      const users = await userService.findAll(criteria, {
        offset: (_page - 1) * _itemsPerPage,
        limit: _itemsPerPage,
        order: _sort,
      });
      res.json(users);
    } catch (err) {
      next(err);
    }
  },
  /**
   * Express.js controller for POST /users
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  post: async (req, res, next) => {
    try {
      // Avoid injecting unwanted fields like role or balance on user creation
      const userPayload = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        avatar: req.body.avatar,
      };
      const user = await userService.create(userPayload);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  },
  /**
   * Express.js controller for GET /users/me
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  me: async (req, res, next) => {
    try {
      const user = await userService.findById(req.user.id);
      if (!user) return res.sendStatus(404);
      res.json(user);
    } catch (err) {
      next(err);
    }
  },
  /**
   * Express.js controller for GET /users/me/avatar
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  meAvatar: async (req, res, next) => {
    try {
      const user = await userService.findByIdAvatar(req.user.id);
      if (!user) return res.sendStatus(404);
      res.sendFile(user.avatar, {
        root: 'public/profile-pictures',
      });
    } catch (err) {
      next(err);
    }
  },
  /**
   * Express.js controller for GET /users/:id
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  get: async (req, res, next) => {
    try {
      const user = await userService.findById(parseInt(req.params.id));
      if (!user) return res.sendStatus(404);
      res.json(user);
    } catch (err) {
      next(err);
    }
  },
  /**
   * Express.js controller for GET /users/:id/avatar
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  getAvatar: async (req, res, next) => {
    try {
      const user = await userService.findById(parseInt(req.params.id));
      if (!user) return res.sendStatus(404);
      res.sendFile(user.avatar, {
        root: 'public/profile-pictures',
      });
    } catch (err) {
      next(err);
    }
  },
  /**
   * Express.js controller for PUT /users/:id
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  put: async (req, res, next) => {
    try {
      await userService.validate(req.body);

      const nbRemoved = await userService.remove({
        id: parseInt(req.params.id),
      });
      const user = await userService.create({
        id: parseInt(req.params.id),
        ...req.body,
      });
      res.status(nbRemoved ? 200 : 201).json(user);
    } catch (err) {
      next(err);
    }
  },
  /**
   * Express.js controller for PATCH /users/:id
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  patch: async (req, res, next) => {
    try {
      const [user] = await userService.update(
        { id: parseInt(req.params.id) },
        req.body
      );
      if (!user) return res.sendStatus(404);
      res.json(user);
    } catch (err) {
      next(err);
    }
  },
  /**
   * Express.js controller for DELETE /users/:id
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  delete: async (req, res, next) => {
    try {
      const nbRemoved = await userService.remove({
        id: parseInt(req.params.id),
      });
      res.sendStatus(nbRemoved ? 204 : 404);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller for Get /collection/
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  getCards: async (req, res, next) => {
    try {
      const cards = await userService.getCards(req.user);
      res.json(cards);
    } catch (err) {
      console.error(err);
      next(err);
    }
  },

  /**
   * Express.js controller for POST /users/:id
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  addCard: async (req, res, next) => {
    try {
      const addCard = await userService.addCard(req.user, req.params.cardId);
      res.json(addCard);
    } catch (err) {
      console.error(err);
      next(err);
    }
  },

  /**
   * Express.js controller for confirm /users/confirm
   * @param {import ('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise <void>}
   */

  confirm: async (req, res, next) => {
    try {
      await userService.confirm(req.body.mailToken);
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  },
};
