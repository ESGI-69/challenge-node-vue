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
};
