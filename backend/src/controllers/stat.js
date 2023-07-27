import statService from '../services/stat.js';

export default {
  /**
   * Express.js controller for GET /stat/cards-count
   *
   * Get the total number of cards.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  getCardsCount: async (req, res, next) => {
    try {
      let cardValue = await statService.getCardCount();
      let parsedValue = {
        count: cardValue[0]['count'],
      };
      res.json(parsedValue);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller for GET /stat/cards-count-by-type
   *
   * Get the total number of cards by type.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  getCardsCountByType: async (req, res, next) => {
    try {
      res.json(await statService.getCardCountByType());
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller for GET /stat/total-xp
   *
   * Get the total xp(sum) of all players.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  getTotalXp: async (req, res, next) => {
    try {
      let totalXpValue = await statService.getTotalXp();
      let parsedValue = {
        xp: totalXpValue[0]['xp'],
      };
      res.json(parsedValue);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller for GET /stat/total-pack-open
   *
   * Get the total number of pack oppened.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  getTotalPackOpen: async (req, res, next) => {
    try {
      let totalPackOpenValue = await statService.getTotalPackOpen();
      let parsedValue = {
        totalOpenedPacks: totalPackOpenValue[0]['totalOpenedPacks'],
      };
      res.json(parsedValue);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller for GET /stat/number-of-pack-open-by-day
   *
   * Get the total number of pack opened by day.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  getNumberOfPackOpenByDay: async (req, res, next) => {
    try {
      res.json(await statService.getNumberOfPackOpenByDay());
    } catch (err) {
      next(err);
    }
  },

  getTotalNumbersOfCurrentGames: async (req, res, next) => {
    try {
      let totalNumbersOfCurrentGamesValue = await statService.getTotalNumbersOfCurrentGames();
      let parsedValue = {
        totalNumbersOfCurrentGames: totalNumbersOfCurrentGamesValue?.[0]?.['totalNumbersOfCurrentGames'] ?? 0,
      };
      res.json(parsedValue);
    } catch (err) {
      next(err);
    }
  },

  getTotalCreditsPurchased: async (req, res, next) => {
    try {
      let totalCreditsPurchasedValue = await statService.getTotalCreditsPurchased();
      let parsedValue = {
        totalCreditsPurchased: totalCreditsPurchasedValue[0]['amount'],
      };
      res.json(parsedValue);
    } catch (err) {
      next(err);
    }
  },

  getTotalMoneySpent: async (req, res, next) => {
    try {
      let totalMoneySpentValue = await statService.getTotalMoneySpent();
      let parsedValue = {
        totalMoneySpent: totalMoneySpentValue[0]['amount'],
      };
      res.json(parsedValue);
    } catch (err) {
      next(err);
    }
  },

  getAverageGameDuration: async (req, res, next) => {
    try {
      let averageGameDurationValue = await statService.getAverageGameDuration();
      let parsedValue = {
        averageGameDurationValue : averageGameDurationValue?.[0]?.averageDuration,
      };
      res.json(parsedValue);
    } catch (err) {
      next(err);
    }
  },

  getBestPlayer: async (req, res, next) => {
    try {
      let bestPlayerValue = await statService.getBestPlayer();
      let parsedValue = {
        bestPlayer: (bestPlayerValue?.[0]?.user[0] ?? {}),
      };
      res.json(parsedValue);
    } catch (err) {
      next(err);
    }
  },

  getBestSellerProduct: async (req, res, next) => {
    try {
      let bestSellerProductValue = await statService.getBestSellerProduct();
      let parsedValue = {
        bestSellerProduct: bestSellerProductValue[0].product[0],
      };
      res.json(parsedValue);
    } catch (err) {
      next(err);
    }
  },

  getTotalUsers: async (req, res, next) => {
    try {
      let totalUsersValue = await statService.getTotalUsers();
      let parsedValue = {
        totalUsers: totalUsersValue[0].totalUsers,
      };
      res.json(parsedValue);
    } catch (err) {
      next(err);
    }
  },

};
