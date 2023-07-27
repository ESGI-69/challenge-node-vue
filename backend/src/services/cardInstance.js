import { CardInstance } from '../db/index.js';

export default {
  create: function (boardId, cardId) {
    return CardInstance.create({
      game_board_id: boardId,
      card_id: cardId,
    });
  },

  findByCardAndBoardId: function (cardId, boardId) {
    return CardInstance.findOne({
      where: {
        card_id: cardId,
        game_board_id: boardId,
      },
      include: 'card',
    });
  },

  findById: function (id) {
    return CardInstance.findByPk(id, {
      include: 'card',
    });
  },

  /**
   * Damage the card instance
   * @param {import('../db/index.js').CardInstance} cardInstanceModel
   * @param {number} damage Damanges to apply;
   */
  damage: function (cardInstanceModel, damage) {
    cardInstanceModel.currentHealth -= damage;
    if (cardInstanceModel.currentHealth < 0) cardInstanceModel.currentHealth = 0;
    return cardInstanceModel.save();
  },
};
