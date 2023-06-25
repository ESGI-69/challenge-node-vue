import jwt from 'jsonwebtoken';
import userService from './services/user.js';

/**
 * User population middleware. This middleware will populate the user in the request object from the JWT token.
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 * @param {import('express').NextFunction} next Express next function
 */
const populateUser = async (req, res, next) => {
  if (
    req.headers.authorization
    && req.headers.authorization?.split(' ').length === 2
    && req.headers.authorization.startsWith('Bearer')
  ) {
    const token = req.headers.authorization?.split(' ')[1];
    try {
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await userService.findById(id);
      if (!req.user) return res.sendStatus(401);
      next();
    } catch (err) {
      return res.sendStatus(401);
    }
  } else {
    next();
  }
};

/**
 * Check if the user is logged in. If not, return 401.
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 * @param {import('express').NextFunction} next Express next function
 */
const isLogged = (req, res, next) => {
  if (!req.user) return res.status(401).send({
    code: 'not_logged_in',
    message: 'Not logged in',
  });
  if (req.user.mailToken) return res.status(401).send({
    code: 'email_not_validated',
    message: 'Email not validated',
  });
  next();
};

/**
 * Check if the user is an Admin. If not, return 401.
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 * @param {import('express').NextFunction} next Express next function
 */
const isAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).send({
    code: 'not_logged_in',
    message: 'Not logged in',
  });
  if (req.user.mailToken) return res.status(401).send({
    code: 'email_not_validated',
    message: 'Email not validated',
  });
  if (!req.user.isAdmin()) return res.sendStatus(403);
  next();
};

/**
 * Check if user has enough money to buy a pack
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 * @param {import('express').NextFunction} next Express next function
 */
const hasPackBalance = (req, res, next) => {
  if (!req.user) return res.sendStatus(401);
  if (!req.user.hasEnoughBalance(100)) return res.status(403).send({
    code: 'balance_too_low',
    message: 'Not enough money',
  });
  next();
};

export {
  populateUser,
  isLogged,
  isAdmin,
  hasPackBalance,
};
