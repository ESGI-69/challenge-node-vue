import { Card, Pack, User } from '../db/index.js';

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

  getCardCountByType: function () {
    const count = Card.mongoModel.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
    ]);
    return count;
  },

  getTotalXp: function () {
    const count = User.mongoModel.aggregate([
      {
        $group: {
          _id: null,
          xp: { $sum: '$xp' },
        },
      },
    ]);
    return count;
  },

  getTotalPackOpen: function () {
    const count = Pack.mongoModel.aggregate([
      {
        $match:
          {
            openedAt: {
              $ne: null,
            },
          },
      },
      {
        $count:
          'totalOpenedPacks',
      },
    ]);
    return count;
  },

  getNumberOfPackOpenByDay: function () {
    const count = Pack.mongoModel.aggregate([
      {
        $match:
          {
            openedAt: {
              $ne: null,
            },
          },
      },
      {
        $group:
          {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$openedAt',
              },
            },
            packOpened: {
              $sum: 1,
            },
          },
      },
    ]);
    return count;
  },
};
