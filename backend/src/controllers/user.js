import jwt from 'jsonwebtoken';

import userService from '../services/user.js';
import cardService from '../services/card.js';
import deckService from '../services/deck.js';
import { Card, User } from '../db/index.js';

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
      _sort = {},
      ...criteria
    } = req.query;
    try {
      const users = await userService.findAll(criteria, {
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
  // post: async (req, res, next) => {
  meUpdate: async (req, res, next) => {
    try {
      let isEmailUpdated = false;
      let isPasswordUpdated = false;
      // Avoid injecting unwanted fields like role or balance on user creation
      const userPayload = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        avatar: req.body.avatar,
        update_password: req.body.update_password,
      };

      // delete avatar field if it's the default one (that means the user didn't change it)
      if (userPayload.avatar === 'default.png') {
        delete userPayload.avatar;
      }

      // Get the current user id with the JWT token
      const token = req.headers.authorization?.split(' ')[1];
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userService.findByIdWithPassword(id);
      if (userPayload.email !== user.email) {
        userPayload.mailToken = null;
      }
      if (!user) return res.sendStatus(401);

      // check if the current password is correct
      if (!await user.checkPassword(userPayload.password)) {
        return res.status(400).send({
          invalidFields: ['current_password'],
        });
      }

      // if the user want to change is password add it to the payload as password
      if (userPayload.update_password) {
        userPayload.password = userPayload.update_password;
        delete userPayload.update_password;
        isPasswordUpdated = true;
      }

      // update the user
      const userUpdate = await userService.update(
        { id: parseInt(id) },
        userPayload,
      );
      if (!userUpdate) return res.sendStatus(404);

      // check if the email has been updated
      if (userUpdate.email !== user.email) {
        isEmailUpdated = true;
      }

      res.json({
        ...userUpdate.dataValues,
        isEmailUpdated,
        isPasswordUpdated,
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
      const user = await userService.findByIdAvatar(parseInt(req.params.id));
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
      const user = await userService.update(
        { id: parseInt(req.params.id) },
        req.body,
      );
      if (!user) return res.sendStatus(404);
      res.json(user);
    } catch (err) {
      next(err);
    }
  },
  /**
   * Express.js controller for PATCH /users/:id/balance
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  patchBalance: async (req, res, next) => {
    try {
      const user = await userService.update(
        { id: parseInt(req.params.id) },
        { balance: req.body.balance },
      );
      if (!user) return res.sendStatus(404);
      res.json(user);
    } catch (err) {
      next(err);
    }
  },
  /**
   * Express.js controller for PATCH /users/:id/ban
   * @param {import ('express').Request} req
   * @param {import ('express').Response} res
   * @param {import ('express').NextFunction} next
   * @returns {Promise <void>}
   */
  patchBan: async (req, res, next) => {
    try {
      const user = await userService.update(
        { id: parseInt(req.params.id) },
        { isBanned: req.body.isBanned },
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
   */
  getCards: async (req, res, next) => {
    try {
      const { order, limit, offset, cost } = req.query;

      const orderDirection = order ? order.startsWith('-') ? 'DESC' : 'ASC' : null;
      const orderField = order ? order.replace('-', '') : null;
      const formatedOrder = orderField ? [[orderField, orderDirection]] : null;

      if (order && !Object.keys(Card.getAttributes()).includes(orderField)) {
        throw new Error(`Invalid order field, ${order.replace('-', '')} is not a valid field`);
      }

      if (cost && (parseInt(cost) < 0 || parseInt(cost) > 10)) {
        throw new Error(`Invalid cost, ${cost} is not a valid cost`);
      }

      let where = {};

      if (cost) {
        where.cost = cost;
      }

      const options = {
        where: {
          ...where,
        },
        include: {
          model: User,
          where: {
            id: req.user.id,
          },
        },
        limit: limit || null,
        offset: offset || null,
        order: formatedOrder,
      };

      const count = await cardService.count(options);

      const cards = await cardService.findAll(options);

      const nextOffset = parseInt(options.offset) + parseInt(options.limit);

      const cleanedCards = cards.map((card) => {
        let cleanCard = card.toJSON();
        cleanCard.obtainedAt = cleanCard.Users[0].User_Card.obtainedAt;
        delete cleanCard.Users;
        return cleanCard;
      });

      res.json({
        count,
        nextOffset,
        cards: cleanedCards,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller for Get /collection/all-ids
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  getAllCardIds: async (req, res, next) => {
    try {
      const options = {
        include: {
          model: User,
          where: {
            id: req.user.id,
          },
        },
        attributes: ['id'],
      };

      let cards = await cardService.findAll(options);
      cards = cards.map((card) => {
        return card.id;
      });
      res.json(cards);
    } catch (err) {
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
   * Express.js controller for confirm /users/confirm-email
   * @param {import ('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise <void>}
   */

  confirmEmail: async (req, res, next) => {
    try {
      await userService.confirmEmail(req.body.mailToken);
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller for POST /users/choose-fav-deck/:id
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  chooseFavDeck: async (req, res, next) => {
    try {
      const deck = await deckService.findById(req.params.id);
      if (!deck) throw new Error('Deck not found', { cause: 'Not Found' });
      if (req.user.id !== deck.userId) throw new Error('You don\'t own this deck', { cause: 'Unauthorized' });

      const choosedFavDeck = await userService.chooseFavDeck(req.user, req.params.id);
      res.json(choosedFavDeck);
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  /**
   * Express.js controller for Get /collection/all-decks-ids
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  getAllDeckIds: async (req, res, next) => {
    try {
      const options = {
        where: { userId: req.user.id },
        attributes: ['id'],
      };

      let decks = await deckService.findAll(options);
      decks = decks.map((deck) => {
        return deck.id;
      });
      res.json(decks);
    } catch (err) {
      next(err);
    }
  },
};
