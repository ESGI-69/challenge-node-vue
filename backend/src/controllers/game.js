import gameService from '../services/game.js';
import generateGameCode from '../utils/generateGameCode.js';
import { asignUserSocketToGameRoom, removeUserSocketFromGameRoom, users } from '../socket/index.js';
import { io } from '../index.js';
import userService from '../services/user.js';

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
      const currentGame = await gameService.findCurrentGameByUser(req.user);

      if (currentGame) throw new Error('User already have a game in progress');

      // generate a code for the game
      let id = await generateGameCode();

      const game = await gameService.create({
        id,
        first_player: req.user.id,
      });

      asignUserSocketToGameRoom(req.user);

      res.status(201).json({ id: game.id });
      // eslint-disable-next-line no-console
      console.log(`[Game ${game.id}] Created by ${req.user.email}`);
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
      if (game.isEnded) throw new Error('Game is ended', { cause: 'Forbidden' });
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
      const game = await gameService.findCurrentGameByUser(req.user);
      if (!game) throw new Error('Game not found', { cause: 'Not Found' });
      if (game.first_player !== req.user.id) throw new Error('You are not the owner of this game');
      const nbRemoved = await gameService.remove({ id: game.id });
      if (nbRemoved) {
        io.to(game.id).emit('game:removed');
        if (game.first_player) removeUserSocketFromGameRoom((await userService.findById(game.first_player)), game.id);
        if (game.second_player) removeUserSocketFromGameRoom((await userService.findById(game.second_player)), game.id);
        res.sendStatus(204);
        // eslint-disable-next-line no-console
        console.log(`[Game ${game.id}] Deleted by ${req.user.email}`);
      } else {
        throw new Error('Game not found', { cause: 'Not Found' });
      }
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

      const updatedGame = await gameService.join(game, req.user);

      asignUserSocketToGameRoom(req.user, gameId);

      let ownerSoket = users[game.first_player];
      ownerSoket.emit('game:joined', updatedGame);

      res.send({ id: updatedGame.id });
      // eslint-disable-next-line no-console
      console.log(`[Game ${game.id}] Joined by ${req.user.email}`);
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
      if (!playerSocket) throw new Error('You are not connected to the socket');

      const game = await gameService.findCurrentGameByUser(req.user);
      if (!game) throw new Error('Game not found', { cause: 'Not Found' });

      if (game.isInProgress) {
        const updatedGame = await gameService.forfeit(game, req.user);
        const secondPlayer = userService.findById(updatedGame.second_player);
        if (updatedGame.first_player === req.user.id) {
          let secondPlayerSocket = users[updatedGame.second_player];
          if (secondPlayerSocket) secondPlayerSocket.emit('game:forfeited', updatedGame);
          removeUserSocketFromGameRoom(secondPlayer, updatedGame.id);
          removeUserSocketFromGameRoom(req.user, updatedGame.id);
        } else {
          let firstPlayerSocket = users[updatedGame.first_player];
          if (firstPlayerSocket) firstPlayerSocket.emit('game:forfeited', updatedGame);
          removeUserSocketFromGameRoom(req.user, updatedGame.id);
          removeUserSocketFromGameRoom(secondPlayer, updatedGame.id);
        }
        // eslint-disable-next-line no-console
        console.log(`[Game ${game.id}] Forfeited by ${req.user.email}`);
      } else {
        const leavedGame = await gameService.leave(req.user);
        removeUserSocketFromGameRoom(req.user, leavedGame.id);
        io.to(leavedGame.id).emit('game:leaved', leavedGame);
        // eslint-disable-next-line no-console
        console.log(`[Game ${game.id}] Leaved by ${req.user.email}`);
      }
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller for POST /games/start
   * Start the game if the user is the owner of the game and the game has two players
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   * */
  start: async (req, res, next) => {
    try {
      const game = await gameService.findCurrentGameByUser(req.user);
      if (!game) throw new Error('Game not found', { cause: 'Not Found' });
      if (game.first_player !== req.user.id) throw new Error('You are not the owner of this game');
      if (!game.hasTwoPlayers) throw new Error('Game has only one player');
      if (game.isInProgress) throw new Error('Game already started');
      const startedGame = await gameService.start(game);
      io.to(game.id).emit('game:started', startedGame);
      res.sendStatus(200);
      // eslint-disable-next-line no-console
      console.log(`[Game ${game.id}] Started`);
    } catch (err) {
      next(err);
    }
  },
};

