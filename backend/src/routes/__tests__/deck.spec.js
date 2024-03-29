// import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { beforeAll, describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { app } from '../../index.js';
import getJwt from '../../../tests/getJwt.js';
import deckService from '../../services/deck.js';

const jwt = await getJwt('janedoe@example.com', '123456');
const jwtNotOwner = await getJwt('johndoe@example.com', '123456');
const adminJwt = await getJwt('admin@example.com', '123456');

const deck = {
  name: 'testCreate',
};

const deckUpdate = {
  name: 'testUpdate',
};

const deckNameEmpty = {
  name: '',
};

const generateDecks = [];
let notOwnedDeckId;

beforeAll(async () => {
  generateDecks.push((await deckService.create({
    name: 'test',
    userId: 2,
  })).id);
  notOwnedDeckId = (await deckService.create({
    name: 'test2',
    userId: 1,
  })).id;
  generateDecks.push(notOwnedDeckId);
});

describe('Pack routes (no logged)', () => {
  it('GET /decks/ should return 401', () => request(app)
    .get('/decks/')
    .expect(401));

  it('GET /decks/1 should return 401', () => request(app)
    .get('/decks/1')
    .expect(401));

  it('POST /decks/ should return 401', () => request(app)
    .post('/decks/')
    .expect(401));

  it('DELETE /decks/1 should return 401', () => request(app)
    .delete('/decks/1')
    .expect(401));

  it('PATCH /decks/1 should return 401', () => request(app)
    .patch('/decks/1')
    .expect(401));

  it('POST /decks/1/cards should return 401', () => request(app)
    .post('/decks/1/cards')
    .send({ cardId: 1 })
    .expect(401));
});

describe('Decks list (logged as user)', () => {
  it('GET /decks/ should return 403', () => request(app)
    .get('/decks/')
    .set('Authorization', `Bearer ${jwt}`)
    .expect(403));
});

describe('Decks list (logged as admin)', () => {
  it('GET /decks/ should return 200 and list decks', () => request(app)
    .get('/decks/')
    .set('Authorization', `Bearer ${adminJwt}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .then(res => {
      expect(res.body).toBeInstanceOf(Array);
    }));
});

describe('One Deck By Id (logged as owner)', () => {
  it('GET /decks/1 should return 200  and the deck', () => request(app)
    .get(`/decks/${generateDecks[0]}`)
    .set('Authorization', `Bearer ${jwt}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .then(res => {
      const deck = res.body;
      expect(deck).toHaveProperty('userId');
      expect(deck.userId).toBe(2);
    }),
  );
});

describe('Create deck (logged)', () => {
  it('POST /decks/ should return 201 and create deck', () => request(app)
    .post('/decks/')
    .set('Authorization', `Bearer ${jwt}`)
    .send({
      params: deck,
    })
    .expect(201)
    .expect('Content-Type', /json/)
    .then(res => {
      const deckCreated = res.body;
      expect(typeof res.body.id).toBe('number');
      expect(deckCreated).toHaveProperty('name');
      expect(res.body.name).toBe(deck.name);
      expect(typeof new Date(res.body.createdAt).toISOString()).toBe('string');
      expect(res.body.createdAt).toBeDefined();
      expect(typeof new Date(res.body.updatedAt).toISOString()).toBe('string');
      expect(res.body.updatedAt).toBeDefined();
    }));
});

describe('Update deck (logged as owner)', () => {
  it('PATCH /decks/1 should return 200 and update deck', () => request(app)
    .patch(`/decks/${generateDecks[0]}`)
    .set('Authorization', `Bearer ${jwt}`)
    .send({
      params: deckUpdate,
    })
    .expect(200)
    .expect('Content-Type', /json/)
    .then(res => {
      const deckUpdate = res.body;
      expect(deckUpdate).toHaveProperty('name');
      expect(res.body.name).toBe('testUpdate');
    }));
});

describe('Update deck (logged but not owner)', () => {
  it('PATCH /decks/1 should return 403', () => request(app)
    .patch(`/decks/${generateDecks[0]}`)
    .set('Authorization', `Bearer ${jwtNotOwner}`)
    .send({
      params: deckUpdate,
    })
    .expect(403));
});

describe('Update deck (empty name)', () => {
  it('PATCH /decks/1 should return 422 and update deck', () => request(app)
    .patch(`/decks/${generateDecks[0]}`)
    .set('Authorization', `Bearer ${jwt}`)
    .send({
      params: deckNameEmpty,
    })
    .expect(422));
});

describe('Add card to deck (logged)', () => {
  it('POST /decks/1/cards should return 200 and add card to deck', () => request(app)
    .post(`/decks/${generateDecks[0]}/cards`)
    .set('Authorization', `Bearer ${jwt}`)
    .send({
      cardId: 3,
    })
    .expect(200)
    .expect('Content-Type', /json/)
    .then(res => {
      expect(res.body).toBeInstanceOf(Object);
    }));
});

describe('Add card to deck (not owner of deck)', () => {
  it('POST /decks/2/cards should return 403', () => request(app)
    .post(`/decks/${notOwnedDeckId}/cards`)
    .set('Authorization', `Bearer ${jwt}`)
    .send({
      cardId: 3,
    })
    .expect(403));
});

describe('Add card to deck (not owner of card)', () => {
  it('POST /decks/1/cards should return 403', () => request(app)
    .post(`/decks/${generateDecks[0]}/cards`)
    .set('Authorization', `Bearer ${jwt}`)
    .send({
      cardId: 1,
    })
    .expect(403));
});

describe('Remove card from deck (logged)', () => {
  it('DELETE /decks/1/cards should return 204', () => request(app)
    .delete(`/decks/${generateDecks[0]}/cards`)
    .set('Authorization', `Bearer ${jwt}`)
    .query({ cardId: 3 })
    .expect(204));
});

describe('Remove card from deck (not owner of deck)', () => {
  it('DELETE /decks/2/cards should return 204', () => request(app)
    .delete(`/decks/${notOwnedDeckId}/cards`)
    .set('Authorization', `Bearer ${jwt}`)
    .query({ cardId: 1 })
    .expect(403));
});

describe('Remove card from deck (not owner of card)', () => {
  it('DELETE /decks/1/cards should return 204', () => request(app)
    .delete(`/decks/${generateDecks[0]}/cards`)
    .set('Authorization', `Bearer ${jwt}`)
    .query({ cardId: 1 })
    .expect(403));
});

describe('Delete deck (not owner)', () => {
  it('DELETE /decks/1 should return 403', () => request(app)
    .delete(`/decks/${notOwnedDeckId}`)
    .set('Authorization', `Bearer ${jwt}`)
    .expect(403));
});

describe('Delete deck (logged)', () => {
  it('DELETE /decks/1 should return 204', () => request(app)
    .delete(`/decks/${generateDecks[0]}`)
    .set('Authorization', `Bearer ${jwt}`)
    .expect(204));
});
