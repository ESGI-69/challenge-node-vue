import { describe, it } from '@jest/globals';
// import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { app } from '../../index.js';
// import getJwt from '../../../tests/getJwt.js';

// const jwt = await getJwt('johndoe@example.com', '123456');
// const adminJwt = await getJwt('admin@example.com', '123456');

describe('Pack routes (no logged)', () => {
  it('GET /deck/ should return 401', () => request(app)
    .get('/deck/')
    .expect(401));

  it('GET /deck/1 should return 401', () => request(app)
    .get('/deck/1')
    .expect(401));

  it('POST /deck/ should return 401', () => request(app)
    .post('/deck/')
    .expect(401));

  it('DELETE /deck/1 should return 401', () => request(app)
    .delete('/deck/1')
    .expect(401));

  it('PATCH /deck/1 should return 401', () => request(app)
    .patch('/deck/1')
    .expect(401));

  it('POST /deck/1/cards should return 401', () => request(app)
    .post('/deck/1/cards')
    .send({ cardId: 1 })
    .expect(401));
});

// describe('Deck list (logged)', () => {
//   it('GET /deck/ should return 200 and list decks', () => request(app)
//     .get('/deck/')
//     .set('Authorization', `Bearer ${jwt}`)
//     .expect(200)
//     .expect('Content-Type', /json/)
//     .then(res => {
//       expect(res.body).toBeInstanceOf(Array);
//     }));
// });

// describe('One Deck By Id (logged)', () => {
//   it('GET /deck/1 should return 200  and the deck', () => request(app)
//     .get('/deck/1')
//     .set('Authorization', `Bearer ${jwt}`)
//     .expect(200)
//     .expect('Content-Type', /json/)
//     .then(res => {
//       expect(res.body).toBeInstanceOf(Deck);
//     }));
// });

// describe('Create deck (logged)', () => {
//   it('POST /deck/ should return 200 and create deck', () => request(app)
//     .post('/deck/')
//     .set('Authorization', `Bearer ${jwt}`)
//     .send({ name: 'test' })
//     .expect(200)
//     .expect('Content-Type', /json/)
//     .then(res => {
//       expect(res.body).toBeInstanceOf(Object);
//     }));
// });

// describe('Delete deck (logged)', () => {
//   it('DELETE /deck/1 should return 200 and delete deck', () => request(app)
//     .delete('/deck/1')
//     .set('Authorization', `Bearer ${jwt}`)
//     .expect(200)
//     .expect('Content-Type', /json/)
//     .then(res => {
//       expect(res.body).toBeInstanceOf(Object);
//     }));
// });

// describe('Update deck (logged)', () => {
//   it('PATCH /deck/1 should return 200 and update deck', () => request(app)
//     .patch('/deck/1')
//     .set('Authorization', `Bearer ${jwt}`)
//     .send({ name: 'test' })
//     .expect(200)
//     .expect('Content-Type', /json/)
//     .then(res => {
//       expect(res.body).toBeInstanceOf(Object);
//     }));
// });

// describe('Add card to deck (logged)', () => {
//   it('POST /deck/1/cards should return 200 and add card to deck', () => request(app)
//     .post('/deck/1/cards')
//     .set('Authorization', `Bearer ${jwt}`)
//     .send({ cardId: 1 })
//     .expect(200)
//     .expect('Content-Type', /json/)
//     .then(res => {
//       expect(res.body).toBeInstanceOf(Object);
//     }));
// });
