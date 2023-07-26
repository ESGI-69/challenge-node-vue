import { Game, User } from '../db/index.js';
import { Op } from 'sequelize';
import { users as userSockets } from '../socket/index.js';
import { io } from '../index.js';
import handService from './hand.js';
import deckService from './deck.js';
import userService from './user.js';

/**
 * Key is the id of the game
 * Value is the timeout
 * @type {Record<string, NodeJS.Timeout>}
 */
const gameTurnsTimeout = {};

export default {
  /**
     * Find all games matching the criteria
     * @param {import('sequelize').WhereOptions} criteria
     * @returns
     * */
  findAll: function (criteria) {
    return Game.findAll({
      where: criteria,
    });
  },
  findAllIds: async function () {
    const games = await Game.findAll({
      attributes: ['id'],
    });
    return games.map((code) => code.id);
  },
  /**
   * @param {string} id Game id
   * @returns {Promise<import('../db/index.js').Game>}
   */
  findById: function (id) {
    return Game.findByPk(id, {
      include: [
        {
          model: User,
          as: 'firstPlayer',
        },
        {
          model: User,
          as: 'secondPlayer',
        },
      ],
    });
  },
  create: function (data) {
    return Game.create(data);
  },
  update: async function (criteria, data) {
    const [, games = []] = await Game.update(data, {
      where: criteria,
      returning: true,
      individualHooks: true,
    });
    return games;
  },
  remove: function (criteria) {
    return Game.destroy({
      where: criteria,
    });
  },
  validate: function (data) {
    return Game.build(data).validate();
  },
  /**
   * Find game where the user is first_player or second_player
   * @param {typeof import('../db/index.js').User} userModel
   */
  findCurrentGameByUser: function (userModel) {
    return Game.findOne({
      where: {
        [Op.or]: [
          { first_player: userModel.id },
          { second_player: userModel.id },
        ],
        endedAt: null,
      },
      include: [
        {
          model: User,
          as: 'firstPlayer',
        },
        {
          model: User,
          as: 'secondPlayer',
        },
      ],
    });
  },
  /**
   * Make the second user leave the game
   * @param {typeof import('../db/index.js').User} gameModel
   * @param {typeof import('../db/index.js').User} userModel
   */
  leave: async function (userModel) {
    const game = await this.findCurrentGameByUser(userModel);
    if (!game) throw new Error('user not in a game');

    if (game.first_player === userModel.id) throw new Error('user is first player');

    game.second_player = null;
    await game.save();
    return this.findById(game.id);
  },
  /**
   * Join the game
   * @param {import('../db/index.js').Game} gameModel
   * @param {import('../db/index.js').User} userModel
   */
  join: async function (gameModel, userModel) {
    gameModel.second_player = userModel.id;
    await gameModel.save();
    return this.findById(gameModel.id);
  },
  /**
   * @param {import('../db/index.js').Game} gameModel
   * @param {import('../db/index.js').User} firstPlayerModel
   * @param {import('../db/index.js').User} secondPlayerModel
   * @returns {Promise<import('../db/index.js').Game>} The updated & stated game
   */
  start: async function (gameModel, firstPlayerModel, secondPlayerModel) {
    gameModel.startedAt = new Date();
    gameModel.first_player_deck = firstPlayerModel.idDeckFav;
    gameModel.second_player_deck = secondPlayerModel.idDeckFav;
    const firstPlayerDeck = await deckService.findById(gameModel.first_player_deck);
    const secondPlayerDeck = await deckService.findById(gameModel.second_player_deck);
    const firstPayerHand = await handService.create(gameModel, firstPlayerModel, firstPlayerDeck);
    const secondPlayerHand = await handService.create(gameModel, secondPlayerModel, secondPlayerDeck);

    if (!firstPayerHand || !secondPlayerHand) throw new Error('Cannot create hand');

    gameModel.first_player_hand = firstPayerHand.id;
    gameModel.second_player_hand = secondPlayerHand.id;
    gameModel.current_player = gameModel.first_player;
    await gameModel.save();
    return this.findById(gameModel.id);
  },
  /**
   * @param {import('../db/index.js').Game} gameModel The game model
   * @param {import('../db/index.js').User} winnerUserModel The winner user model
   */
  forfeit: function (gameModel, winnerUserModel) {
    return this.end(gameModel, winnerUserModel, 'surrender');
  },
  /**
   * @param {import('../db/index.js').Game} gameModel The game model
   * @param user Winner
   * @param {'surrender' | 'disconnect' | 'health'} reason The reason why the game ended
   */
  end: async function (gameModel, user, reason = 'health') {
    clearTimeout(gameTurnsTimeout[gameModel.id]);
    gameModel.winner = user.id;
    gameModel.endedAt = new Date();
    gameModel.endType = reason;
    const game = await gameModel.save();
    await userService.addMoney(user, 150);
    await userService.addXp(user, 150);
    const winnerUser = await userService.findById(user.id);
    const looserId = game.first_player === user.id ? game.second_player : game.first_player;
    userSockets[looserId].emit('game:loose', game);
    userSockets[gameModel.winner].emit('game:win', game, winnerUser);
  },
  /**
   * Start the timer for the current player
   * @param {import('../db/index.js').Game} gameModel
   */
  startTimer: function (gameModel) {
    gameTurnsTimeout[gameModel.id] = setTimeout(() => this.changePlayerTurn(gameModel), 30000);
  },
  /**
   * Switch the current player turn
   * @param {import('../db/index.js').Game} gameModel
   * @param {boolean} forced If the turn change asked by the user
   * @returns {Promise<import('../db/index.js').Game>}
   */
  changePlayerTurn: async function (gameModel, forced = false) {
    await gameModel.reload(); // Reload the game to get the updated current_player and ensure the game is still in progress
    if (!gameModel.isInProgress) return;
    const oldPlayerId = gameModel.current_player;
    gameModel.current_player = gameModel.current_player === gameModel.first_player ? gameModel.second_player : gameModel.first_player;
    await gameModel.save();
    if (oldPlayerId) userSockets[oldPlayerId].emit('game:turn:end', gameModel);
    userSockets[gameModel.current_player].emit('game:turn:start', gameModel);
    if (forced) clearTimeout(gameTurnsTimeout[gameModel.id]);
    gameTurnsTimeout[gameModel.id] = setTimeout(() => this.changePlayerTurn(gameModel), 30000);
    // eslint-disable-next-line no-console
    console.log(`[Game ${gameModel.id}] Turn changed to ${gameModel.current_player} at ${new Date().toLocaleTimeString()} ${forced ? '(asked by the user)' : ''}`);
    return gameModel;
  },

  /**
   * Get the game history of the user
   * @param {typeof import('../db/index.js').User} userModel
   * @returns {Promise<import('../db/index.js').Game[]>}
   */
  getHistory: async function (userModel) {
    const games = await Game.findAll({
      where: {
        [Op.or]: [
          { first_player: userModel.id },
          { second_player: userModel.id },
        ],
        endedAt: {
          [Op.ne]: null,
        },
      },
      include: [
        {
          model: User,
          as: 'firstPlayer',
          attributes: { exclude: ['email', 'password', 'role', 'avatar', 'balance', 'mailToken', 'xp', 'createdAt', 'updatedAt'] },
        },
        {
          model: User,
          as: 'secondPlayer',
          attributes: { exclude: ['email', 'password', 'role', 'avatar', 'balance', 'mailToken', 'xp', 'createdAt', 'updatedAt'] },
        },
      ],
    });
    return games;
  },

  /**
   * Attack the player with the given card
   * @param {import('../db/index.js').Game} gameModel
   * @param {import('../db/index.js').Card} attackCardModel
   */
  attackPlayer: async function (gameModel, attackCardModel) {
    const isCurrentPlayerIsFirstPlayer = gameModel.current_player === gameModel.first_player;
    if (isCurrentPlayerIsFirstPlayer) {
      gameModel.second_player_hp -= attackCardModel.attack;
    } else {
      gameModel.first_player_hp -= attackCardModel.attack;
    }
    await gameModel.save();
    io.to(gameModel.id).emit('game:attack:player', gameModel, attackCardModel);
    if (gameModel.first_player_hp <= 0) {
      const winner = await userService.findById(gameModel.second_player);
      this.end(gameModel, winner, 'health');
    }
    if (gameModel.second_player_hp <= 0) {
      const winner = await userService.findById(gameModel.first_player);
      return this.end(gameModel, winner, 'health');
    }
  },
};
