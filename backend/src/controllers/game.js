import gameService from '../services/game.js';
import generateGameCode from '../utils/generateGameCode.js';
import { users } from '../socket/index.js';

export default {
  /**
   * Express.js controller for POST /games
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   **/
  post: async (req, res, next) => {
    try {
      const currentGame = await gameService.findByUserId(req.user);

      if (currentGame) throw new Error('user already in a game');

      // generate a code for the game
      let id = await generateGameCode();

      const game = await gameService.create({
        id,
        first_player: req.user.id,
      });

      // create a room and make the socketId join it
      let playerSocket = users[req.user.id];
      if (!playerSocket) {
        throw new Error('not connected to socket io');
      } else {
        playerSocket.join(id);
      }

      res.status(201).json(game);
    }
    catch (err) {
      next(err);
    }
  },
  /**
     * Express.js controller for GET /games/:id
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {Promise<void>}
     * */
  get: async (req, res, next) => {
    try {
      const game = await gameService.findById(req.params.id);
      res.json(game);
    }
    catch (err) {
      next(err);
    }
  },

  /**
    * Express.js controller for PATCH /games/:id
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    * @param {import('express').NextFunction} next
    * @returns {Promise<void>}
    */
  patch: async (req, res, next) => {
    try {
      const [game] = await gameService.update(
        { id: parseInt(req.params.id) },
        req.body,
      );
      if (!game) return res.sendStatus(404);
      res.json(game);
    } catch (err) {
      next(err);
    }
  },

  /**
     * Express.js controller for DELETE /games/:id
     * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  delete: async (req, res, next) => {
    try {
      const nbRemoved = await gameService.remove({
        id: parseInt(req.params.id),
      });
      res.sendStatus(nbRemoved ? 204 : 404);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller for GET /games/:id
   * Leave the game if the user is the second player of a game
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   * */
  leaveGame: async (req, res, next) => {
    try {
      let playerSocket = users[req.user.id];
      const leavedGame = await gameService.leave(req.user);

      // leave the socket io room
      if (!playerSocket) throw new Error('You are not connected to the socket');
      playerSocket.leave(leavedGame.id);
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  },
};

