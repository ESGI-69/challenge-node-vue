import { Board } from '../db/index.js';

export default {
  findById: (id) => {
    return Board.findByPk(id);
  },

  /**
   * Create a new board
   * @param {import('../index.js').Game} gameModel
   * @param {import('../index.js').User} userModel
   * @returns
   */
  create: (gameModel, userModel) => {
    return Board.create({
      game_id: gameModel.id,
      user_id: userModel.id,
    });
  },
};
