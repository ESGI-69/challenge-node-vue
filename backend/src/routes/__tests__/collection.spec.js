import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { app } from '../../index.js';
import getJwt from '../../../tests/getJwt.js';

const jwt = await getJwt();

describe('Collection routes (no logged)', () => {
  it('GET /collection/ should return 401', () => request(app)
    .get('/collection/')
    .expect(401));

  it('GET /collection/all-ids should return 401', () => request(app)
    .get('/collection/all-ids')
    .expect(401));
});

describe('Table collection route (logged)', () => {
  it('GET /collection/ should return an array of cards', () => request(app)
    .get('/collection/')
    .set('Authorization', `Bearer ${jwt}`)
    .expect(200)
    .then(({ body: { cards, count } }) => {
      expect(typeof count).toBe('number');
      expect(cards).toBeInstanceOf(Array);
      cards.forEach((card) => {
        expect(card).toHaveProperty('id');
        expect(card).toHaveProperty('name');
        expect(card).toHaveProperty('rarity');
        expect(card).toHaveProperty('attack');
        expect(card).toHaveProperty('health');
        expect(card).toHaveProperty('description');
        expect(card).toHaveProperty('obtainedAt');
      });
    }));

  it('GET /collection/ with cost query should return cards with the same cost', () => request(app)
    .get('/collection/')
    .query({ cost: 4 })
    .set('Authorization', `Bearer ${jwt}`)
    .expect(200)
    .then(({ body: { cards, count } }) => {
      expect(typeof count).toBe('number');
      expect(cards).toBeInstanceOf(Array);
      cards.forEach((card) => {
        expect(card).toHaveProperty('id');
        expect(card).toHaveProperty('name');
        expect(card).toHaveProperty('rarity');
        expect(card).toHaveProperty('attack');
        expect(card).toHaveProperty('health');
        expect(card).toHaveProperty('description');
        expect(card).toHaveProperty('obtainedAt');
        expect(card.cost).toBe(4);
      });
    }));

  it('GET /collection/ with cost order query should return cards sorted by cost asc', () => request(app)
    .get('/collection/')
    .query({ order: 'cost' })
    .set('Authorization', `Bearer ${jwt}`)
    .expect(200)
    .then(({ body: { cards, count } }) => {
      expect(typeof count).toBe('number');
      expect(cards).toBeInstanceOf(Array);
      cards.forEach((card) => {
        expect(card).toHaveProperty('id');
        expect(card).toHaveProperty('name');
        expect(card).toHaveProperty('rarity');
        expect(card).toHaveProperty('attack');
        expect(card).toHaveProperty('health');
        expect(card).toHaveProperty('description');
        expect(card).toHaveProperty('obtainedAt');
      });
      let prevCost = 0;
      cards.forEach((card) => {
        expect(card.cost).toBeGreaterThanOrEqual(prevCost);
        prevCost = card.cost;
      });
    }));

  it('GET /collection/ with -cost order query should return cards sorted by cost desc', () => request(app)
    .get('/collection/')
    .query({ order: '-cost' })
    .set('Authorization', `Bearer ${jwt}`)
    .expect(200)
    .then(({ body: { cards, count } }) => {
      expect(typeof count).toBe('number');
      expect(cards).toBeInstanceOf(Array);
      cards.forEach((card) => {
        expect(card).toHaveProperty('id');
        expect(card).toHaveProperty('name');
        expect(card).toHaveProperty('rarity');
        expect(card).toHaveProperty('attack');
        expect(card).toHaveProperty('health');
        expect(card).toHaveProperty('description');
        expect(card).toHaveProperty('obtainedAt');
      });
      let prevCost = 100;
      cards.forEach((card) => {
        expect(card.cost).toBeLessThanOrEqual(prevCost);
        prevCost = card.cost;
      });
    }));

  it('GET /collection/ with limit 10 & offset 0 query should return 10 cards', () => request(app)
    .get('/collection/')
    .query({ limit: 5, offset: 0 })
    .set('Authorization', `Bearer ${jwt}`)
    .expect(200)
    .then(({ body: { cards, count } }) => {
      expect(typeof count).toBe('number');
      expect(cards).toBeInstanceOf(Array);
      expect(cards.length).toBeLessThanOrEqual(10);
      cards.forEach((card) => {
        expect(card).toHaveProperty('id');
        expect(card).toHaveProperty('name');
        expect(card).toHaveProperty('rarity');
        expect(card).toHaveProperty('attack');
        expect(card).toHaveProperty('health');
        expect(card).toHaveProperty('description');
        expect(card).toHaveProperty('obtainedAt');
      });
    }));

  it('GET /collection/ with limit 5 & offset 0 query should return the same cards as before', () => request(app)
    .get('/collection/')
    .query({ limit: 3, offset: 0 })
    .set('Authorization', `Bearer ${jwt}`)
    .expect(200)
    .then(({ body: { cards, count } }) => {
      expect(typeof count).toBe('number');
      expect(cards).toBeInstanceOf(Array);
      expect(cards.length).toBeLessThanOrEqual(5);
      cards.forEach((card) => {
        expect(card).toHaveProperty('id');
        expect(card).toHaveProperty('name');
        expect(card).toHaveProperty('rarity');
        expect(card).toHaveProperty('attack');
        expect(card).toHaveProperty('health');
        expect(card).toHaveProperty('description');
        expect(card).toHaveProperty('obtainedAt');
      });
    }));
});

describe('List collection cards IDs route (logged)', () => {
  it('GET /collection/all-ids should return an array of cards IDs', () => request(app)
    .get('/collection/all-ids')
    .set('Authorization', `Bearer ${jwt}`)
    .expect(200)
    .then(({ body: cardsIds }) => {
      expect(cardsIds).toBeInstanceOf(Array);
      cardsIds.forEach((cardId) => {
        expect(cardId).toBeGreaterThan(0);
      });
    }));
});
