import { Game, User } from '../db/index.js';
import { Op } from 'sequelize';

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
  start: async function (gameModel) {
    gameModel.startedAt = new Date();
    await gameModel.save();
    return this.findById(gameModel.id);
  },
  forfeit: function (gameModel, userModel) {
    return this.end(gameModel, userModel, 'surrender');
  },
  /**
   * @param user Winner
   * @param {'surrender' | 'disconnect' | 'health'} reason The reason why the game ended
   */
  end: function (gameModel, user, reason = 'health') {
    gameModel.winner = user.id;
    gameModel.endedAt = new Date();
    gameModel.endType = reason;
    return gameModel.save();
  },
};
