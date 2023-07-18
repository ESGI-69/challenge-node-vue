import statService from '../services/stat.js';

export default {
  /**
   * Express.js controller for POST /games
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   **/

  getCardsCount: async (req, res, next) => {
    try {
      const count = await statService.getCardCount();
      res.json(count);
    } catch (err) {
      next(err);
    }
  },

  getCardsCountByType: async (req, res, next) => {
    try {
      const count = await statService.getCardCountByType();
      res.json(count);
    } catch (err) {
      next(err);
    }
  },

  getTotalXp: async (req, res, next) => {
    try {
      const count = await statService.getTotalXp();
      res.json(count);
    } catch (err) {
      next(err);
    }
  },

  getTotalPackOpen: async (req, res, next) => {
    try {
      const count = await statService.getTotalPackOpen();
      res.json(count);
    } catch (err) {
      next(err);
    }
  },

  getNumberOfPackOpenByDay: async (req, res, next) => {
    try {
      const count = await statService.getNumberOfPackOpenByDay();
      res.json(count);
    } catch (err) {
      next(err);
    }
  },
};
