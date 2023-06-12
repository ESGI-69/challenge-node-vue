import packService from '../services/pack.js';
import userService from '../services/user.js';

export default {

  /**
   * Express.js controller for POST /packs/buy
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  buy: async (req, res, next) => {
    try {
      const pack = await packService.create(req.user);

      // Remove the cost of the pack from the user's balance
      await userService.removeMoney(req.user, 100);

      // Send the pack to the user
      res.status(201).json({ pack, cost: 100 });
    } catch (err) {
      console.log(err);
      next(err);
    }
  },

  open: function (req, res, next) {
    try {
      console.log('open');
    } catch (err) {
      next(err);
    }
  },
};

