import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { app } from '../../index.js';
import getJwt from '../../../tests/getJwt.js';

const game = {
    id: 1,
    token: '1234567890',
    first_player: 1,
    second_player: null,
    winnerd: null,
};

const newGame = {
    id: 2,
    token: '0987654321',
    first_player: 1,
    second_player: null,
    winnerd: null,
};

const playerToken = await getJwt('git ', '123456');
// const adminToken = await getJwt('admin@example.com', '123456');

let gameCreated = {};
describe('Creating a game (logged)', () => {
    it('POST /game/ should return 201', () => request(app)
        .post('/game')
        .set('Authorization', `Bearer ${playerToken}`)
        .send({ socketId: '1234567890' })
        .expect(201)
        .expect('Content-Type', /json/)
        .then(res => {
            gameCreated = res.body;
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('first_player');
            expect(res.body).toHaveProperty('second_player');
            expect(res.body).toHaveProperty('winner');
        }));
});

describe('Recreating a game while the other is not finished (logged)', () => {
    it('POST /game/ should return 201 (and the same game object)', () => request(app)
        .post('/game')
        .set('Authorization', `Bearer ${playerToken}`)
        .send({ socketId: '1234567890' })
        .expect(201)
        .expect('Content-Type', /json/)
        .then(res => {
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('first_player');
            expect(res.body).toHaveProperty('second_player');
            expect(res.body).toHaveProperty('winner');
            expect(res.body.token).toEqual(gameCreated.token);
        }));
});



describe('Creating a game (not logged)', () => {
    it('POST /game/ should return 401', () => request(app)
        .post('/game')
        .expect(401)
        .expect('Content-Type', /json/)
        .then(res => {
            expect(res.body).toHaveProperty('code');
            expect(res.body.code).toEqual('not_logged_in');
        }));
}
);

describe('Leaving a game (logged)', () => {
    it('POST /game/leave/:id should return 204', () => request(app)
        .post(`/game/leave/${gameCreated.id}`)
        .set('Authorization', `Bearer ${playerToken}`)
        .send({ socketId: '1234567890'})
        .expect(204));
});


describe('Leaving a game (not logged)', () => {
    it('POST /game/leave/:id should return 401', () => request(app)
        .post(`/game/leave/${gameCreated.id}`)
        .expect(401));
}
);

describe('Leaving a game that does not exist (logged)', () => {
    it('POST /game/leave/:id should return 404', () => request(app)
        .post(`/game/leave/9999`)
        .send({ socketId: '1234567890'})
        .set('Authorization', `Bearer ${playerToken}`)
        .expect(404));
});
