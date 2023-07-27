import { Card, Game, Pack, Payment, User } from '../db/index.js';

export default {
  getCardCount: function () {
    const count = Card.mongoModel.aggregate([
      {
        $count:
          'count',
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
        $group: {
          _id: null,
          totalOpenedPacks: {
            $sum: { $cond: [{ $eq: ['$openedAt', null] }, 0, 1] },
          },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);
    return count;
  },

  getNumberOfPackOpenByDay: function () {
    const count = Pack.mongoModel.aggregate([
      {
        $match: {
          openedAt: {
            $ne: null,
          },
        },
      },
      {
        $addFields: {
          openedAtDate: {
            $dateFromParts: {
              year: { $year: '$openedAt' },
              month: { $month: '$openedAt' },
              day: { $dayOfMonth: '$openedAt' },
              hour: 0,
              minute: 0,
              second: 0,
              millisecond: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: {
            // $dateToString: {
            //   format: '%Y-%m-%d',
            //   date: '$openedAt',
            // },
            $toLong: '$openedAtDate',
          },
          packOpened: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
    return count;
  },

  /**
   * Admin stats
   */
  getTotalCreditsPurchased: function () {
    const count = Payment.mongoModel.aggregate([
      {
        $lookup:
          {
            from: 'products',
            localField: 'productId',
            foreignField: 'id',
            as: 'product',
          },
      },
      {
        $match:
          {
            status: {
              $eq: 'PAID',
            },
          },
      },
      {
        $addFields:
          {
            totalProductSold: {
              $sum: '$product.value',
            },
          },
      },
      {
        $group:
          {
            _id: null,
            amount: {
              $sum: '$totalProductSold',
            },
          },
      },
    ]);
    return count;
  },

  getTotalNumbersOfCurrentGames: function () {

    if (!Game.mongoModel) {
      return [];
    }
    const count = Game.mongoModel.aggregate([
      {
        $match:
          {
            endedAt: {
              $eq: null,
            },
          },
      },
      {
        $count:
          'totalNumbersOfCurrentGames',
      },
    ]);
    return count;
  },

  getTotalMoneySpent: function () {
    const count = Payment.mongoModel.aggregate([
      {
        $lookup:
          {
            from: 'products',
            localField: 'productId',
            foreignField: 'id',
            as: 'product',
          },
      },
      {
        $match:
          {
            status: {
              $eq: 'PAID',
            },
          },
      },
      {
        $addFields:
          {
            totalProductPrice: {
              $sum: '$product.price',
            },
          },
      },
      {
        $group:
          {
            _id: null,
            amount: {
              $sum: '$totalProductPrice',
            },
          },
      },
    ]);
    return count;
  },

  getBestSellerProduct: function () {
    const count = Payment.mongoModel.aggregate(
      [
        {
          $group:
            /**
             * _id: The id of the group.
             * fieldN: The first field name.
             */
            {
              _id: '$productId',
              totalSales: {
                $sum: 1,
              },
            },
        },
        {
          $sort:
            /**
             * Provide any number of field/order pairs.
             */
            {
              totalSales: -1,
            },
        },
        {
          $limit: 1,
        },
        // loopup, link _id with product
        {
          $lookup:
            {
              from: 'products',
              localField: '_id',
              foreignField: 'id',
              as: 'product',
            },
        },
      ],

    );
    return count;
  },

  getAverageGameDuration: function () {
    //response is in ms

    if (!Game.mongoModel) {
      return [];
    }

    const count = Game.mongoModel.aggregate([
      {
        $match:
          {
            endedAt: {
              $ne: null,
            },
          },
      },
      {
        $addFields:
          {
            duration: {
              $subtract: ['$endedAt', '$startedAt'],
            },
          },
      },
      {
        $group:
          {
            _id: null,
            averageDuration: {
              $avg: '$duration',
            },
          },
      },
    ]);
    return count;
  },

  getBestPlayer: function () {

    if (!Game.mongoModel) {
      return [];
    }

    const count = Game.mongoModel.aggregate([[
      {
        $match: {
          endedAt: {
            $ne: null,
          },
        },
      },
      {
        $group: {
          _id: '$winner',
          totalWin: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          totalWin: -1,
        },
      },
      {
        $limit: 1,
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'id',
          as: 'user',
        },
      },
    ]]);
    return count;
  },

  getTotalUsers: function () {
    const count = User.mongoModel.aggregate([
      {
        $count: 'totalUsers',
      },
    ]);
    return count;
  },

};
