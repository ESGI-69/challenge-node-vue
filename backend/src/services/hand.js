import { Card, Hand } from '../db/index.js';

export default {
  async create(GameModel, UserModel, DeckModel) {
    const hand = await Hand.create({
      game_id: GameModel.id,
      user_id: UserModel.id,
    });
    const deckCards = await DeckModel.getCards();
    await hand.addCards(deckCards);
    return hand;
  },

  findById(id) {
    return Hand.findByPk(id, {
      include: [
        {
          model: Card,
          as: 'cards',
        },
      ],
    });
  },

  /**
   * Count card in hand
   * @param {number} id
   * @returns {Promise<number>} Number of cards
   */
  async countCards(id) {
    const hand = await this.findById(id);
    return hand.cards.length;
  },
};
