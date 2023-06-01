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
      if (!req.user) throw new Error('User not found');
      next();
    } catch (err) {
      return next(err);
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
  if (!req.user) return res.sendStatus(401);
  next();
};

/**
 * Check if the user is an Admin. If not, return 401.
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 * @param {import('express').NextFunction} next Express next function
 */
const isAdmin = (req, res, next) => {
  if (!req.user) return res.sendStatus(401);
  if (req.user.role !== 'ADMIN') return res.sendStatus(403);
  next();
};

export {
  populateUser,
  isLogged,
  isAdmin,
};
