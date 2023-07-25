import { Hand } from '../db/index.js';

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
};
