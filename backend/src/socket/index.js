import { io } from '../index.js';
import jwt from 'jsonwebtoken';
import gameService from '../services/game.js';
import userService from '../services/user.js';

const reasignSocketToGameRoom = async (userId) => {
  const user = await userService.findById(userId);
  const game = await gameService.findByUser(user);
  if (!user || !game) return;
  const socket = users[user.id];
  if (!socket) return;
  await socket.join(game.id);
  // eslint-disable-next-line no-console
  console.log(`Socket ${socket.id} (user ${user.email}) reconnected to room ${game.id}`);
};

/**
 * @type {Object.<string, import('socket.io').Socket>}
 */
export let users = {};

export default () => {
  io.on('connection', (client) => {
    // eslint-disable-next-line no-console
    console.log('Client connected');
    const clientJwt = client.handshake.query.token;
    try {
      jwt.verify(clientJwt, process.env.JWT_SECRET);
      const { id } = jwt.decode(clientJwt);
      users[id] = client;
      reasignSocketToGameRoom(id);
    } catch {
      console.error('Invalid jwt');
      client.disconnect();
      return;
    }

    client.on('disconnect', () => {
      // eslint-disable-next-line no-console
      console.log('Client disconnected');
      delete users[client.id];
    });
  });
};
