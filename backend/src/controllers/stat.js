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
};
