import { Board } from '../db/index.js';

export default {
  findById: function (id) {
    return Board.findByPk(id);
  },

  /**
   * Create a new board
   * @param {import('../index.js').Game} gameModel
   * @param {import('../index.js').User} userModel
   */
  create: function (gameModel, userModel) {
    return Board.create({
      game_id: gameModel.id,
      user_id: userModel.id,
    });
  },

  /**
   * @param {import('../index.js').Board} boardModel
   * @param {import('../index.js').CardInstance} cardInstanceModel
   */
  addCardInstance: function (boardModel, cardInstanceModel) {
    return boardModel.addCardInstance(cardInstanceModel);
  },
};
