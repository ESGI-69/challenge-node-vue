import gameService from '../services/game.js';
import userService from '../services/user.js';
import generateGameCode from '../utils/generateGameCode.js';
import { io } from '../index.js';
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

  leaveGame: async (req, res, next) => {
    if (!req.body.socketId) {
      res.status(400).json({ error: 'missing socketId' });
      return;
    }
    try {
      // check if the game id is in the database with the req.user.id in the first_player or second_player
      let user = await userService.findById(req.user.id);
      if (!user) throw new Error('User not found');
      const currentGame = await gameService.findByUserId(user);
      let socketId = req.body.socketId;
      let roomId = null;
      if (!currentGame) {
        res.status(404).json({ error: 'You are not in a game' });
        return;
      }
      // return res.status(200).json(req);
      // if the game has the user id
      if (currentGame && (currentGame.first_player === user.id || currentGame.second_player === user.id)) {
        const nbRemoved = await gameService.remove({
          id: parseInt(req.params.id),
        });
        res.sendStatus(nbRemoved ? 204 : 404);

        // leave the room
        let playerSocket = io.sockets.sockets.get(socketId);
        roomId = currentGame.token;

        if (!playerSocket) {
          res.status(404).json({ error: 'You are not connected to the socket' });
          return;
        } else {
          playerSocket.leave(roomId);
        }

      } else {
        // L'user essaie de quitter une game dans laquelle il n'est pas
        res.status(403).json({ error: 'You are not permitted to leave this game' });
      }
    } catch (err) {
      next(err);
    }
  },
};

