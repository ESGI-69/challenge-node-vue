import gameService from '../services/game.js';
import generateGameCode from '../utils/generateGameCode.js';
import { users } from '../socket/index.js';
import { io } from '../index.js';

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

      res.status(201).json({ id: game.id });
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
      if (!game) throw new Error('Game not found', { cause: 'Not Found' });
      if (game.first_player !== req.user.id && game.second_player !== req.user.id) throw new Error('You\'r not in this game', { cause: 'Unauthorized' });
      res.json(game);
    }
    catch (err) {
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
      const game = await gameService.findByUserId(req.user);
      if (!game) throw new Error('Game not found', { cause: 'Not Found' });
      if (game.first_player !== req.user.id) throw new Error('You are not the owner of this game');
      const nbRemoved = await gameService.remove({ id: game.id });
      io.to(game.id).emit('game:deleted');
      res.sendStatus(nbRemoved ? 204 : 404);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller for POST /games/join
   * Leave the game if the user is the second player of a game
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   * */
  join: async (req, res, next) => {
    try {
      if (!req.body.id) throw new Error('Missing game id');
      /**
       * Game ID
       * @type {string}
       */
      const gameId = req.body.id;
      if (gameId.length !== 6) throw new Error('Invalid game id');
      const game = await gameService.findById(gameId);
      if (!game) throw new Error('Game not found', { cause: 'Not Found' });
      if (game.first_player === req.user.id) throw new Error('You cannot join your own game');
      if (game.second_player) throw new Error('Game already has two players');

      let playerSocket = users[req.user.id];
      playerSocket.join(gameId);

      let ownerSoket = users[game.first_player];

      const updatedGame = await gameService.join(game, req.user);

      ownerSoket.emit('game:joined', updatedGame);
      res.send({ id: updatedGame.id });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller for POST /games/leave
   * Leave the game if the user is the second player of a game
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   * */
  leave: async (req, res, next) => {
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

