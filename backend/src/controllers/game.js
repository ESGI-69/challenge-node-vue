import gameService from '../services/game.js';
import handService from '../services/hand.js';
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
  get: (req, res, next) => {
    try {
      res.json(req.game);
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
      const nbRemoved = await gameService.remove({ id: req.game.id });
      if (nbRemoved) {
        io.to(req.game.id).emit('game:removed');
        if (req.game.first_player) removeUserSocketFromGameRoom((await userService.findById(req.game.first_player)), req.game.id);
        if (req.game.second_player) removeUserSocketFromGameRoom((await userService.findById(req.game.second_player)), req.game.id);
        res.sendStatus(204);
        // eslint-disable-next-line no-console
        console.log(`[Game ${req.game.id}] Deleted by ${req.user.email}`);
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
      if (req.game.isInProgress) {
        const secondPlayer = await userService.findById(req.game.second_player);
        /**
         * @type {import('../db/index.js').Game}
         */
        let updatedGame;
        /**
         * @type {import('../db/index.js').User}
         */
        let winner;
        if (req.game.first_player === req.user.id) {
          winner = secondPlayer;
        } else {
          winner = req.user;
        }
        updatedGame = await gameService.forfeit(req.game, winner);
        await userService.addMoney(winner, 50);
        await userService.addXp(winner, 50);
        let winnerSocket = users[winner.id];
        if (winnerSocket) winnerSocket.emit('game:forfeited', updatedGame);
        removeUserSocketFromGameRoom(req.user, updatedGame.id);
        removeUserSocketFromGameRoom(secondPlayer, updatedGame.id);
        // eslint-disable-next-line no-console
        console.log(`[Game ${req.game.id}] Forfeited by ${req.user.email}`);
      } else {
        const leavedGame = await gameService.leave(req.user);
        removeUserSocketFromGameRoom(req.user, leavedGame.id);
        io.to(leavedGame.id).emit('game:leaved', leavedGame);
        // eslint-disable-next-line no-console
        console.log(`[Game ${req.game.id}] Leaved by ${req.user.email}`);
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
      if (!req.game.hasTwoPlayers) throw new Error('Game has only one player');
      if (req.game.isInProgress) throw new Error('Game already started');
      // Check if the decks are set
      const firstPlayer = await userService.findById(req.game.first_player);
      const secondPlayer = await userService.findById(req.game.second_player);
      if (!firstPlayer.hasFavoriteDeck || !secondPlayer.hasFavoriteDeck) throw new Error('One of the players has no favorite deck');

      const startedGame = await gameService.start(req.game, firstPlayer, secondPlayer);
      io.to(req.game.id).emit('game:started', startedGame);
      gameService.startTimer(startedGame);
      res.sendStatus(200);
      // eslint-disable-next-line no-console
      console.log(`[Game ${req.game.id}] Started`);
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
      if (req.game.current_player !== req.user.id) throw new Error('It\'s not your turn', { cause: 'Forbidden' });
      await gameService.changePlayerTurn(req.game, true);
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller for GET /games/history
   * Get the game history of the user
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   **/
  getHistory: async (req, res, next) => {
    try {
      const games = await gameService.getHistory(req.user);

      // if games is empty, return 204, else return 200 with the games (clean the user model)
      if (games.length === 0) {
        res.sendStatus(204);
      }
      else {
        res.json(games);
      }

    } catch (err) {
      next(err);
    }
  },
  /**
   * Express.js controller for GET /games/hand
   * Get the hand of the current player if the user is in a game in progress
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  getHand: async (req, res, next) => {
    try {
      const handId = req.game.first_player === req.user.id ? req.game.first_player_hand : req.game.second_player_hand;
      const hand = await handService.findById(handId);
      res.json(hand);
    } catch (err) {
      next(err);
    }
  },
};

