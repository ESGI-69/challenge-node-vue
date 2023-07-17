import { io } from '../index.js';
import jwt from 'jsonwebtoken';
import gameService from '../services/game.js';
import userService from '../services/user.js';

/**
 * Assign the user socket to the game room
 * @param {import('../models').User} user
 * @param {string} [gameId] If not provided, the current game of the user will be used
 */
export const asignUserSocketToGameRoom = async (user, gameId) => {
  const id = gameId || (await gameService.findCurrentGameByUser(user))?.id;
  if (!user || !id) return;
  const socket = users[user.id];
  if (!socket) return;
  await socket.join(id);
  // eslint-disable-next-line no-console
  console.log(`[Socket ${user.email}] Connected to room ${id}`);
};

/**
 * Remove the user socket from the game room
 * @param {import('../models').User} user
 * @param {string} [gameId] If not provided, the current game of the user will be used
 */
export const removeUserSocketFromGameRoom = async (user, gameId) => {
  const id = gameId || (await gameService.findCurrentGameByUser(user))?.id;
  if (!user || !id) return;
  const socket = users[user.id];
  if (!socket) return;
  await socket.leave(id);
  // eslint-disable-next-line no-console
  console.log(`[Socket ${user.email}] Disconnected from room ${id}`);
};

/**
 * @type {Object.<string, import('socket.io').Socket>}
 */
export let users = {};

export default () => {
  io.on('connection', async (client) => {
    let user;
    const clientJwt = client.handshake.query.token;
    try {
      jwt.verify(clientJwt, process.env.JWT_SECRET);
      const { id } = jwt.decode(clientJwt);
      user = await userService.findById(id);
      users[id] = client;
      // eslint-disable-next-line no-console
      console.log(`[Socket ${user.email}] Connected`);
      asignUserSocketToGameRoom(user);
    } catch {
      console.error('Invalid jwt');
      client.disconnect();
      return;
    }

    client.on('disconnect', () => {
      // eslint-disable-next-line no-console
      console.log(`[Socket ${user.email}] disconnected`);
      delete users[client.id];
    });
  });
};
