import { io } from '../index.js';
import jwt from 'jsonwebtoken';

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
