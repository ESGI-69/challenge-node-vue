import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from '@jest/globals';
import request from 'supertest';
import { io as Client } from 'socket.io-client';

import { app, server } from '../../index.js';
import gameService from '../../services/game.js';

import getJwt from '../../../tests/getJwt.js';

const jwt = await getJwt();
const secondJwt = await getJwt('janedoe@example.com', '123456');
const thirdJwt = await getJwt('admin@example.com', '123456');

/**
 * Socket of the first player
 * @type {import('socket.io').Socket}
 */
let firstPlayerSocket;
/**
 * Socket of the second player
 * @type {import('socket.io').Socket}
 */
let secondPlayerSocket;
/**
 * Socket of the third player
 * @type {import('socket.io').Socket}
 **/
let thirdPlayerSocket;

describe('Game routes (no logged)', () => {
  it('GET /game/:id should return 401', () => request(app)
    .get('/game/notId')
    .expect(401));

  it('POST /game/ should return 401', () => request(app)
    .post('/game')
    .expect(401));

  it('POST /game/leave should return 401', () => request(app)
    .post('/game/leave')
    .expect(401));

  it('POST /game/join should return 401', () => request(app)
    .post('/game/join')
    .expect(401));

  it('DELETE /game/ should return 401', () => request(app)
    .delete('/game')
    .expect(401));
});

describe('Game routes (logged)', () => {
  beforeAll((done) => {
    server.listen(3000, () => {
      firstPlayerSocket = Client('ws://localhost:3000', {
        query: {
          token: jwt,
        },
      });
      secondPlayerSocket = Client('ws://localhost:3000', {
        query: {
          token: secondJwt,
        },
      });
      thirdPlayerSocket = Client('ws://localhost:3000', {
        query: {
          token: thirdJwt,
        },
      });
      let connectedSocket = 0;
      const socketConnected = () => {
        connectedSocket += 1;
        if (connectedSocket === 3) {
          done();
        }
      };
      firstPlayerSocket.connect();
      firstPlayerSocket.on('connect', () => {
        socketConnected();
      });
      secondPlayerSocket.connect();
      secondPlayerSocket.on('connect', () => {
        socketConnected();
      });
      thirdPlayerSocket.connect();
      thirdPlayerSocket.on('connect', () => {
        socketConnected();
      });
    });
  });

  let gameId;

  afterAll((done) => {
    firstPlayerSocket.disconnect();
    secondPlayerSocket.disconnect();
    thirdPlayerSocket.disconnect();
    server.close(done);
  });

  it('GET /game/:id that not exist should return 404', () => request(app)
    .get('/game/notId')
    .set('Authorization', `Bearer ${jwt}`)
    .expect(404));

  it('POST /game should create a game', () => request(app)
    .post('/game')
    .set('Authorization', `Bearer ${jwt}`)
    .expect(201)
    .then((response) => {
      expect(response.body).toHaveProperty('id');
      gameId = response.body.id;
    }));

  it('POST /game should return 400 if player is allready in a game', () => request(app)
    .post('/game')
    .set('Authorization', `Bearer ${jwt}`)
    .expect(400));

  it(`GET /game/${gameId} should return the game`, () => request(app)
    .get(`/game/${gameId}`)
    .set('Authorization', `Bearer ${jwt}`)
    .expect(200)
    .then((response) => {
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('first_player');
      expect(typeof response.body.first_player).toBe('number');
      expect(response.body).toHaveProperty('firstPlayer');
      expect(response.body.firstPlayer).toHaveProperty('id');
      expect(response.body.firstPlayer).toHaveProperty('firstname');
      expect(response.body).toHaveProperty('second_player');
      expect(response.body.second_player).toBeNull();
      expect(response.body).toHaveProperty('secondPlayer');
      expect(response.body.secondPlayer).toBeNull();
      expect(response.body).toHaveProperty('endedAt');
      expect(response.body.endedAt).toBeNull();
      expect(response.body).toHaveProperty('winner');
      expect(response.body.winner).toBeNull();
    }));

  it('POST /game/leave should return 404 if player is not in a game', () => request(app)
    .post('/game/leave')
    .set('Authorization', `Bearer ${secondJwt}`)
    .expect(404));

  it('POST /game/join should return the id of the game & send the joined event to the first player', (done) => {
    let successCount = 0;

    const success = () => {
      successCount += 1;
      if (successCount === 2) {
        done();
      }
    };

    firstPlayerSocket.on('game:joined', (data) => {
      expect(data).toHaveProperty('id');
      expect(data.id).toBe(gameId);
      expect(data).toHaveProperty('second_player');
      expect(typeof data.second_player).toBe('number');
      expect(data).toHaveProperty('secondPlayer');
      expect(data.secondPlayer).toHaveProperty('id');
      expect(data.secondPlayer).toHaveProperty('firstname');
      success();
    });

    request(app)
      .post('/game/join')
      .send({ id: gameId })
      .set('Authorization', `Bearer ${secondJwt}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.id).toBe(gameId);
        success();
      });
  });

  it('POST /game/join should return 400 if game is full', () => request(app)
    .post('/game/join')
    .send({ id: gameId })
    .set('Authorization', `Bearer ${thirdJwt}`)
    .expect(400));

  it('POST /game/leave should return the id of the game & send the left event to the first player', (done) => {
    let successCount = 0;

    const success = () => {
      successCount += 1;
      if (successCount === 2) {
        done();
      }
    };

    firstPlayerSocket.on('game:leaved', (data) => {
      expect(data).toHaveProperty('id');
      expect(data.id).toBe(gameId);
      expect(data).toHaveProperty('second_player');
      expect(data.second_player).toBeNull();
      expect(data).toHaveProperty('secondPlayer');
      expect(data.secondPlayer).toBeNull();
      success();
    });

    request(app)
      .post('/game/leave')
      .set('Authorization', `Bearer ${secondJwt}`)
      .expect(200)
      .then(success);
  });

  it('POST /game/leave should return 404 if player is not in a game', () => request(app)
    .post('/game/leave')
    .set('Authorization', `Bearer ${secondJwt}`)
    .expect(404));

  it('POST /game/join should return the id of the game & send the joined event to the first player affter a player has leaved', (done) => {
    let successCount = 0;

    const success = () => {
      successCount += 1;
      if (successCount === 2) {
        done();
      }
    };

    firstPlayerSocket.on('game:joined', (data) => {
      expect(data).toHaveProperty('id');
      expect(data.id).toBe(gameId);
      expect(data).toHaveProperty('second_player');
      expect(typeof data.second_player).toBe('number');
      expect(data).toHaveProperty('secondPlayer');
      expect(data.secondPlayer).toHaveProperty('id');
      expect(data.secondPlayer).toHaveProperty('firstname');
      success();
    });

    request(app)
      .post('/game/join')
      .send({ id: gameId })
      .set('Authorization', `Bearer ${thirdJwt}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.id).toBe(gameId);
        success();
      });
  });

  it('DELTE /game should return 404 if the user don\'t have any game', () => request(app)
    .delete('/game')
    .set('Authorization', `Bearer ${secondJwt}`)
    .expect(404));

  it('DELETE /game should return 400 if the user don\'t own the game', () => request(app)
    .delete('/game')
    .set('Authorization', `Bearer ${thirdJwt}`)
    .expect(400));

  it('DELETE /game sould send an game:removed to the socket room', (done) => {
    let successCount = 0;

    const success = () => {
      successCount += 1;
      if (successCount === 3) {
        done();
      }
    };

    firstPlayerSocket.on('game:removed', () => {
      success();
    });

    thirdPlayerSocket.on('game:removed', () => {
      success();
    });

    request(app)
      .delete('/game')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(204)
      .then(success);
  });

  it('The game should be removed', () => gameService.findById(gameId)
    .then((game) => {
      expect(game).toBeNull();
    }));
});
