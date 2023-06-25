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
  it('GET /collection/ should return an array of cards', async () => {
    const { body: cards } = await request(app)
      .get('/collection/')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200);
    expect(cards).toBeInstanceOf(Array);
    expect(cards).toHaveLength(5);
    cards.forEach((card) => {
      expect(card).toHaveProperty('id');
      expect(card).toHaveProperty('name');
      expect(card).toHaveProperty('rarity');
      expect(card).toHaveProperty('attack');
      expect(card).toHaveProperty('health');
      expect(card).toHaveProperty('description');
    });
  });
});
