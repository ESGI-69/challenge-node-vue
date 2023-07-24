import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import request from 'supertest';
import { io as Client } from 'socket.io-client';

import { app, server } from '../../index.js';
import gameService from '../../services/game.js';
import userService from '../../services/user.js';

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

  it('GET /game/:id should return the game', () => request(app)
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

describe('Game launch and forfeit', () => {
  beforeAll(async () => {
    // create game a make the 2 players join it
    await request(app)
      .post('/game')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(201)
      .then((response) => {
        gameId = response.body.id;
      });
  });

  it('POST /game/start should return 400 if the game is not full', () => request(app)
    .post('/game/start')
    .set('Authorization', `Bearer ${jwt}`)
    .expect(400));

  it('... second player join the game', (done) => {
    let successCount = 0;

    const success = () => {
      successCount += 1;
      if (successCount === 2) {
        done();
      }
    };

    firstPlayerSocket.on('game:joined', () => {
      success();
    });

    request(app)
      .post('/game/join')
      .send({ id: gameId })
      .set('Authorization', `Bearer ${secondJwt}`)
      .expect(200)
      .then(success);
  });

  it('POST /game/start should return 400 if the user don\'t own the game', () => request(app)
    .post('/game/start')
    .set('Authorization', `Bearer ${secondJwt}`)
    .expect(400));

  it('POST /game/start should return 200 and send game:started to the socket room', (done) => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    jest.spyOn(gameService, 'changePlayerTurn');
    let successCount = 0;

    const success = () => {
      successCount += 1;
      if (successCount === 3) {
        done();
      }
    };

    firstPlayerSocket.on('game:started', (game) => {
      expect(game).toHaveProperty('id');
      expect(game.id).toBe(gameId);
      expect(game).toHaveProperty('startedAt');
      expect(game.startedAt).not.toBeNull();
      expect(game).toHaveProperty('endedAt');
      expect(game.endedAt).toBeNull();
      expect(game).toHaveProperty('endType');
      expect(game.endType).toBeNull();
      expect(game).toHaveProperty('winner');
      expect(game.winner).toBeNull();
      expect(game).toHaveProperty('first_player');
      expect(typeof game.first_player).toBe('number');
      expect(game).toHaveProperty('firstPlayer');
      expect(game.firstPlayer).toHaveProperty('id');
      expect(game.firstPlayer).toHaveProperty('firstname');
      expect(game).toHaveProperty('second_player');
      expect(typeof game.second_player).toBe('number');
      expect(game).toHaveProperty('secondPlayer');
      expect(game.secondPlayer).toHaveProperty('id');
      expect(game.secondPlayer).toHaveProperty('firstname');
      expect(game).toHaveProperty('current_player');
      expect(typeof game.current_player).toBe('number');
      expect(game.current_player).toBe(game.first_player);
      expect(game).toHaveProperty('turnStartedAt');
      expect(game.turnStartedAt).toBeDefined();
      expect(game.current_player).toBe(game.first_player);
      expect(game.turn_count).toBe(1);
      expect(game.first_player_mana).toBe(1);
      expect(game.second_player_mana).toBe(1);
      success();
    });

    secondPlayerSocket.on('game:started', (game) => {
      expect(game).toHaveProperty('id');
      expect(game.id).toBe(gameId);
      expect(game).toHaveProperty('startedAt');
      expect(game.startedAt).not.toBeNull();
      expect(game).toHaveProperty('endedAt');
      expect(game.endedAt).toBeNull();
      expect(game).toHaveProperty('endType');
      expect(game.endType).toBeNull();
      expect(game).toHaveProperty('winner');
      expect(game.winner).toBeNull();
      expect(game).toHaveProperty('first_player');
      expect(typeof game.first_player).toBe('number');
      expect(game).toHaveProperty('firstPlayer');
      expect(game.firstPlayer).toHaveProperty('id');
      expect(game.firstPlayer).toHaveProperty('firstname');
      expect(game).toHaveProperty('second_player');
      expect(typeof game.second_player).toBe('number');
      expect(game).toHaveProperty('secondPlayer');
      expect(game.secondPlayer).toHaveProperty('id');
      expect(game.secondPlayer).toHaveProperty('firstname');
      expect(game).toHaveProperty('current_player');
      expect(typeof game.current_player).toBe('number');
      expect(game.current_player).toBe(game.first_player);
      expect(game).toHaveProperty('turnStartedAt');
      expect(game.turnStartedAt).toBeDefined();
      expect(game.current_player).toBe(game.first_player);
      expect(game.turn_count).toBe(1);
      expect(game.first_player_mana).toBe(1);
      expect(game.second_player_mana).toBe(1);
      success();
    });

    request(app)
      .post('/game/start')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200)
      .then(() => {
        // Check if the gameService.changePlayerTurn is called after 30 seconds
        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 30000);
        success();
      });
  });

  it('The game should be started', () => gameService.findById(gameId)
    .then((game) => {
      expect(game).toHaveProperty('startedAt');
      expect(game.startedAt).not.toBeNull();
      expect(game).toHaveProperty('endedAt');
      expect(game.endedAt).toBeNull();
      expect(game).toHaveProperty('endType');
      expect(game.endType).toBeNull();
      expect(game).toHaveProperty('current_player');
      expect(typeof game.current_player).toBe('number');
      expect(game.current_player).toBe(game.first_player);
    }));

  it('The turn should be changed after 30 seconds', () => {
    jest.advanceTimersByTime(31000); // 1000ms more let the time to the data to be saved in the database
    expect(gameService.changePlayerTurn).toHaveBeenCalledTimes(1);
  });

  let userBalance, userXp;

  it('The current player manualy change the turn', (done) => {
    let successCount = 0;

    const success = () => {
      successCount += 1;
      if (successCount === 3) {
        done();
      }
    };

    firstPlayerSocket.on('game:turn:start', (game) => {
      expect(game).toHaveProperty('id');
      expect(game.id).toBe(gameId);
      expect(game).toHaveProperty('startedAt');
      expect(game.startedAt).not.toBeNull();
      expect(game).toHaveProperty('endedAt');
      expect(game.endedAt).toBeNull();
      expect(game).toHaveProperty('endType');
      expect(game.endType).toBeNull();
      expect(game).toHaveProperty('winner');
      expect(game.winner).toBeNull();
      expect(game).toHaveProperty('first_player');
      expect(typeof game.first_player).toBe('number');
      expect(game).toHaveProperty('firstPlayer');
      expect(game.firstPlayer).toHaveProperty('id');
      expect(game.firstPlayer).toHaveProperty('firstname');
      expect(game).toHaveProperty('second_player');
      expect(typeof game.second_player).toBe('number');
      expect(game).toHaveProperty('secondPlayer');
      expect(game.secondPlayer).toHaveProperty('id');
      expect(game.secondPlayer).toHaveProperty('firstname');
      expect(game).toHaveProperty('current_player');
      expect(typeof game.current_player).toBe('number');
      expect(game.current_player).toBe(game.first_player);
      expect(game).toHaveProperty('turnStartedAt');
      expect(game.turnStartedAt).toBeDefined();
      expect(game.current_player).toBeDefined();
      expect(game.turn_count).toBeDefined();
      expect(game.first_player_mana).toBeDefined();
      expect(game.second_player_mana).toBeDefined();
      success();
    });

    secondPlayerSocket.on('game:turn:end', (game) => {
      expect(game).toHaveProperty('id');
      expect(game.id).toBe(gameId);
      expect(game).toHaveProperty('startedAt');
      expect(game.startedAt).not.toBeNull();
      expect(game).toHaveProperty('endedAt');
      expect(game.endedAt).toBeNull();
      expect(game).toHaveProperty('endType');
      expect(game.endType).toBeNull();
      expect(game).toHaveProperty('winner');
      expect(game.winner).toBeNull();
      expect(game).toHaveProperty('first_player');
      expect(typeof game.first_player).toBe('number');
      expect(game).toHaveProperty('firstPlayer');
      expect(game.firstPlayer).toHaveProperty('id');
      expect(game.firstPlayer).toHaveProperty('firstname');
      expect(game).toHaveProperty('second_player');
      expect(typeof game.second_player).toBe('number');
      expect(game).toHaveProperty('secondPlayer');
      expect(game.secondPlayer).toHaveProperty('id');
      expect(game.secondPlayer).toHaveProperty('firstname');
      expect(game).toHaveProperty('current_player');
      expect(typeof game.current_player).toBe('number');
      expect(game.current_player).toBe(game.first_player);
      expect(game).toHaveProperty('turnStartedAt');
      expect(game.turnStartedAt).toBeDefined();
      expect(game.turn_count).toBeDefined();
      expect(game.first_player_mana).toBeDefined();
      expect(game.second_player_mana).toBeDefined();
      success();
    });

    request(app)
      .post('/game/end-turn')
      .set('Authorization', `Bearer ${secondJwt}`)
      .expect(200)
      .then(success);
  });

  it('The turn should not be changed before 30 seconds', () => {
    jest.advanceTimersByTime(20000);
    expect(gameService.changePlayerTurn).toHaveBeenCalledTimes(2);
  });

  it('The turn should be changed after 30 seconds', () => {
    jest.advanceTimersByTime(10000);
    expect(gameService.changePlayerTurn).toHaveBeenCalledTimes(3);
  });

  it('... fetching future winner balance & xp', async () => {
    const user = await userService.findById(2);
    expect(user).toHaveProperty('balance');
    expect(user).toHaveProperty('xp');
    userBalance = user.balance;
    userXp = user.xp;
  });

  it('POST /game/leave should return 200 and send game:forfeited to the socket room', (done) => {
    let successCount = 0;

    const success = () => {
      successCount += 1;
      if (successCount === 2) {
        done();
      }
    };

    secondPlayerSocket.on('game:forfeited', () => {
      success();
    });

    request(app)
      .post('/game/leave')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200)
      .then(success);
  });

  it('The game should be forfeited', () => gameService.findById(gameId)
    .then((game) => {
      expect(game).toHaveProperty('endedAt');
      expect(game.endedAt).not.toBeNull();
      expect(game).toHaveProperty('endType');
      expect(game.endType).toBe('surrender');
      expect(game).toHaveProperty('winner');
      expect(game.winner).toBe(2);
    }));

  it('The winner should have win 50 gold and 50 exp', () => userService.findById(2)
    .then((user) => {
      expect(user).toHaveProperty('balance');
      expect(user.balance).toBe(userBalance + 50);
      expect(user).toHaveProperty('xp');
      expect(user.xp).toBe(userXp + 50);
    }));

  afterAll(async () => {
    await gameService.remove({ id: gameId });
  });
});
