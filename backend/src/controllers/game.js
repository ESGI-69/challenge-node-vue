import gameService from '../services/game.js';
import handService from '../services/hand.js';
import generateGameCode from '../utils/generateGameCode.js';
import { asignUserSocketToGameRoom, removeUserSocketFromGameRoom, users } from '../socket/index.js';
import { io } from '../index.js';
import { users as userSockets } from '../socket/index.js';
import userService from '../services/user.js';
import boardService from '../services/board.js';
import cardInstanceService from '../services/cardInstance.js';

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

      const firstPlayerHand = await handService.findById(startedGame.first_player_hand);
      const firstPlayerHandCardsCount = await handService.countCards(startedGame.first_player_hand);
      const secondPlayerHand = await handService.findById(startedGame.second_player_hand);
      const secondPlayerHandCardsCount = await handService.countCards(startedGame.second_player_hand);

      users[req.game.first_player].emit('game:started', startedGame, firstPlayerHand, secondPlayerHandCardsCount);
      users[req.game.second_player].emit('game:started', startedGame, secondPlayerHand, firstPlayerHandCardsCount);
      // io.to(req.game.id).emit('game:started', startedGame);
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

  /**
   * Express.js controller for GET /games/opponent-hand
   * Get the number of card in the hand of the opponent player if the user is in a game in progress
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  countOpponentCards: async (req, res, next) => {
    try {
      const isFistPlayer = req.game.first_player === req.user.id;
      const handId = isFistPlayer ? req.game.second_player_hand : req.game.first_player_hand;
      const count = await handService.countCards(handId);
      res.json({ count });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller for GET /games/attack/player
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  attackPlayer: async (req, res, next) => {
    try {
      if (!req.body.cardId) {
        throw new Error('Missing cardId in body');
      }

      const playerBoard = await boardService.findById(req.game.current_player === req.game.first_player ? req.game.first_player_board : req.game.second_player_board);
      const attackerCardInstance = await cardInstanceService.findByCardAndBoardId(req.body.cardId, playerBoard.id);
      if (!attackerCardInstance) throw new Error('This card is not in your board');
      if (attackerCardInstance.allreadyAttacked) throw new Error('This card already attacked', { cause: 'Forbidden' });

      await gameService.attackPlayer(req.game, attackerCardInstance);
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  },
  /**
   * Express.js controller for GET /games/game-running
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  getGameRunningByUserId: async (req, res, next) => {
    try {
      const game = await gameService.findCurrentGameByUser(req.user);

      res.json(game);
    } catch (err) {
      next(err);
    }
  },
  /**
  * Place a deck card card on the board
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  * @param {import('express').NextFunction} next
  */
  placeCard: async (req, res, next) => {
    try {
      if (!req.body.cardId) {
        throw new Error('Missing cardId in body');
      }
      const hand = await handService.findById(req.game.current_player === req.game.first_player ? req.game.first_player_hand : req.game.second_player_hand);
      const board = await boardService.findById(req.game.current_player === req.game.first_player ? req.game.first_player_board : req.game.second_player_board);
      const isCardInHand = await handService.containCard(hand, req.body.cardId);
      if (!isCardInHand) throw new Error('Card not in hand', { cause: 'Forbidden' });
      await handService.removeCard(hand, req.body.cardId);
      const updatedHand = await handService.findById(hand.id);

      // Create a new card instance
      const cardInstance = await cardInstanceService.create(board.id, req.body.cardId);
      // Add the card instance to the board
      await boardService.addCardInstance(board, cardInstance);

      const updatedGame = await gameService.findById(req.game.id);

      req.socket.emit('game:player-hand', updatedHand, updatedGame);
      const opponentSocket = userSockets[req.game.current_player === req.game.first_player ? req.game.second_player : req.game.first_player];
      opponentSocket.emit('game:opponent-hand', updatedHand.cards.length, updatedGame);
      // io.to(req.game.id).emit('game:board:add', req.body.cardId);
    } catch (err) {
      next(err);
    }
  },

  /**
  * Attack opponent card placed on the board
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  * @param {import('express').NextFunction} next
  */
  attackCard: async (req, res, next) => {
    try {
      if (!req.body.attackerCardId) {
        throw new Error('Missing attackerCardId in body');
      }
      if (!req.body.targetCardId) {
        throw new Error('Missing targetCardId in body');
      }

      const playerBoard = await boardService.findById(req.game.current_player === req.game.first_player ? req.game.first_player_board : req.game.second_player_board);
      const attackerCardInstance = await cardInstanceService.findByCardAndBoardId(req.body.attackerCardId, playerBoard.id);
      if (!attackerCardInstance) throw new Error('This card is not in your board');
      if (attackerCardInstance.allreadyAttacked) throw new Error('This card already attacked', { cause: 'Forbidden' });
      const attackerCardAttack = attackerCardInstance.card.attack;

      const opponentBoard = await boardService.findById(req.game.current_player === req.game.first_player ? req.game.second_player_board : req.game.first_player_board);
      const targetCardInstance = await cardInstanceService.findByCardAndBoardId(req.body.targetCardId, opponentBoard.id);
      if (!targetCardInstance) {
        throw new Error('Your opponent don\'t have this card on his board');
      }
      const targetCardAttack = targetCardInstance.card.attack;

      // Mark the cards as user for this turn
      attackerCardInstance.allreadyAttacked = true;
      await attackerCardInstance.save();

      // Damage the cards
      const { currentHealth: targetCardHealth } = await cardInstanceService.damage(targetCardInstance, attackerCardAttack);
      const { currentHealth: attackerCardHealth } = await cardInstanceService.damage(attackerCardInstance, targetCardAttack);

      const game = await gameService.findById(req.game.id);
      io.to(req.game.id).emit('game:attack:card', game, req.body.attackerCardId, req.body.targetCardId, targetCardHealth <= 0, attackerCardHealth <= 0);
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  },
};
