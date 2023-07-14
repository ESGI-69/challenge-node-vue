import { Card } from '../db/index.js';

export default {
  getCardCount: function () {
    const count = Card.mongoModel.aggregate([
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);
    return count;
  },

};
