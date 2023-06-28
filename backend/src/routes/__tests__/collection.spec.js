import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { app } from '../../index.js';
import getJwt from '../../../tests/getJwt.js';

const jwt = await getJwt();

describe('Collection routes (no logged)', () => {
  it('GET /collection/ should return 401', () => request(app)
    .get('/collection/')
    .expect(401));
});

describe('Collection routes (logged)', () => {
  it('GET /collection/ should return an array of cards', () => request(app)
    .get('/collection/')
    .set('Authorization', `Bearer ${jwt}`)
    .expect(200)
    .then(({ body: { data: cards, count } }) => {
      expect(typeof count).toBe('number');
      expect(cards).toBeInstanceOf(Array);
      cards.forEach((card) => {
        expect(card).toHaveProperty('id');
        expect(card).toHaveProperty('name');
        expect(card).toHaveProperty('rarity');
        expect(card).toHaveProperty('attack');
        expect(card).toHaveProperty('health');
        expect(card).toHaveProperty('description');
      });
    }));

  it('GET /collection/ with cost query should return cards with the same cost', () => request(app)
    .get('/collection/')
    .query({ cost: 4 })
    .set('Authorization', `Bearer ${jwt}`)
    .expect(200)
    .then(({ body: { data: cards, count } }) => {
      expect(typeof count).toBe('number');
      expect(cards).toBeInstanceOf(Array);
      cards.forEach((card) => {
        expect(card).toHaveProperty('id');
        expect(card).toHaveProperty('name');
        expect(card).toHaveProperty('rarity');
        expect(card).toHaveProperty('attack');
        expect(card).toHaveProperty('health');
        expect(card).toHaveProperty('description');
        expect(card.cost).toBe(4);
      });
    }));

  it('GET /collection/ with cost order query should return cards sorted by cost asc', () => request(app)
    .get('/collection/')
    .query({ order: 'cost' })
    .set('Authorization', `Bearer ${jwt}`)
    .expect(200)
    .then(({ body: { data: cards, count } }) => {
      expect(typeof count).toBe('number');
      expect(cards).toBeInstanceOf(Array);
      cards.forEach((card) => {
        expect(card).toHaveProperty('id');
        expect(card).toHaveProperty('name');
        expect(card).toHaveProperty('rarity');
        expect(card).toHaveProperty('attack');
        expect(card).toHaveProperty('health');
        expect(card).toHaveProperty('description');
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
    .then(({ body: { data: cards, count } }) => {
      expect(typeof count).toBe('number');
      expect(cards).toBeInstanceOf(Array);
      cards.forEach((card) => {
        expect(card).toHaveProperty('id');
        expect(card).toHaveProperty('name');
        expect(card).toHaveProperty('rarity');
        expect(card).toHaveProperty('attack');
        expect(card).toHaveProperty('health');
        expect(card).toHaveProperty('description');
      });
      let prevCost = 100;
      cards.forEach((card) => {
        expect(card.cost).toBeLessThanOrEqual(prevCost);
        prevCost = card.cost;
      });
    }));

  let cardsThatIKnowThatExist = [];

  it('GET /collection/ with limit 10 & offset 0 query should return 10 cards', () => request(app)
    .get('/collection/')
    .query({ limit: 5, offset: 0 })
    .set('Authorization', `Bearer ${jwt}`)
    .expect(200)
    .then(({ body: { data: cards, count } }) => {
      expect(typeof count).toBe('number');
      expect(cards).toBeInstanceOf(Array);
      expect(cards.length).toBe(5);
      cards.forEach((card) => {
        expect(card).toHaveProperty('id');
        expect(card).toHaveProperty('name');
        expect(card).toHaveProperty('rarity');
        expect(card).toHaveProperty('attack');
        expect(card).toHaveProperty('health');
        expect(card).toHaveProperty('description');
      });
      cardsThatIKnowThatExist = cards;
    }));

  it('GET /collection/ with limit 5 & offset 0 query should return the same cards as before', () => request(app)
    .get('/collection/')
    .query({ limit: 3, offset: 0 })
    .set('Authorization', `Bearer ${jwt}`)
    .expect(200)
    .then(({ body: { data: cards, count } }) => {
      expect(typeof count).toBe('number');
      expect(cards).toBeInstanceOf(Array);
      expect(cards.length).toBe(3);
      cards.forEach((card) => {
        expect(card).toHaveProperty('id');
        expect(card).toHaveProperty('name');
        expect(card).toHaveProperty('rarity');
        expect(card).toHaveProperty('attack');
        expect(card).toHaveProperty('health');
        expect(card).toHaveProperty('description');
      });
      expect(cards).toEqual(cardsThatIKnowThatExist.slice(0, 3));
    }));
});
