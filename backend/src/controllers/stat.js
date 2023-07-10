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
      res.json(await statService.getCardCount());
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
      res.json(await statService.getTotalXp());
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
      res.json(await statService.getTotalPackOpen());
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
};