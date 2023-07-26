import jwt from 'jsonwebtoken';
import userService from './services/user.js';
import gameService from './services/game.js';
import { users } from './socket/index.js';

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
  if (req.user.isBanned) return res.status(401).send({
    code: 'banned',
    message: 'You are banned',
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

/**
 * Check if the user is connected to a socket. If not, return 401.
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 * @param {import('express').NextFunction} next Express next function
 */
const isConnectedToSocket = (req, res, next) => {
  try {
    if (!users[req.user.id]) throw new Error('User not connected to socket', { cause: 'Unauthorized', code: 'not_connected_to_socket' });
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Check if the user is in a game. If not, return 404.
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 * @param {import('express').NextFunction} next Express next function
 */
const isInGame = async(req, res, next) => {
  try {
    const game = await gameService.findCurrentGameByUser(req.user);
    if (!game) throw new Error('Game not found', { cause: 'Not Found' });
    req.game = game;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Check if the user is not in a game. Else, return 403.
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 * @param {import('express').NextFunction} next Express next function
 */
const isNotInGame = async(req, res, next) => {
  try {
    const game = await gameService.findCurrentGameByUser(req.user);
    if (game) throw new Error('User already in a game', { cause: 'Unauthorized' });
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Check if the user is in a game in progress. If not, return 403.
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 * @param {import('express').NextFunction} next Express next function
 */
const isInProgressGame = async (req, res, next) => {
  try {
    const game = await gameService.findCurrentGameByUser(req.user);
    if (!game)  throw new Error('Game not found', { cause: 'Not Found' });
    if (!game.isInProgress) throw new Error('Game not in progress', { cause: 'Unauthorized' });
    req.game = game;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Check if the user is the owner of the game. If not, return 403. Must be used after isInGame middleware.
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 * @param {import('express').NextFunction} next Express next function
 */
const isGameOwner = (req, res, next) => {
  try {
    if (req.game.first_player !== req.user.id) throw new Error('You are not the owner of this game', { cause: 'Unauthorized' });
    next();
  } catch (error) {
    next(error);
  }
};

export {
  populateUser,
  isLogged,
  isAdmin,
  hasPackBalance,
  isInProgressGame,
  isInGame,
  isConnectedToSocket,
  isNotInGame,
  isGameOwner,
};
