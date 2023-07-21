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
   * Join a game if the user is not the owner of the game and the game has no second player yet
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
      const gameId = req.body.id?.toLowerCase();
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
        const secondPlayer = await userService.findById(game.second_player);
        /**
         * @type {import('../db/index.js').Game}
         */
        let updatedGame;
        /**
         * @type {import('../db/index.js').User}
         */
        let winner;
        if (game.first_player === req.user.id) {
          winner = secondPlayer;
        } else {
          winner = req.user;
        }
        updatedGame = await gameService.forfeit(game, winner);
        await userService.addMoney(winner, 50);
        await userService.addXp(winner, 50);
        let winnerSocket = users[winner.id];
        if (winnerSocket) winnerSocket.emit('game:forfeited', updatedGame);
        removeUserSocketFromGameRoom(req.user, updatedGame.id);
        removeUserSocketFromGameRoom(secondPlayer, updatedGame.id);
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
      if (game.first_player !== req.user.id) throw new Error('You are not the owner of this game', { cause: 'Forbidden' });
      if (!game.hasTwoPlayers) throw new Error('Game has only one player');
      if (game.isInProgress) throw new Error('Game already started');
      const startedGame = await gameService.start(game);
      io.to(game.id).emit('game:started', startedGame);
      setTimeout(() => gameService.changePlayerTurn(startedGame), 30000);
      res.sendStatus(200);
      // eslint-disable-next-line no-console
      console.log(`[Game ${game.id}] Started`);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller for POST /games/end-turn
   * End the turn of the current player if the user is the current player of the game, the game is in progress & this is the turn of the user
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   **/
  endTurn: async (req, res, next) => {
    try {
      const game = await gameService.findCurrentGameByUser(req.user);
      if (!game) throw new Error('Game not found', { cause: 'Not Found' });
      if (!game.isInProgress) throw new Error('Game is not in progress', { cause: 'Forbidden' });
      if (game.current_player !== req.user.id) throw new Error('It\'s not your turn', { cause: 'Forbidden' });
      await gameService.changePlayerTurn(game);
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  },
};

