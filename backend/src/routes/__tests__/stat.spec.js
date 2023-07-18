import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { app } from '../../index.js';
import getJwt from '../../../tests/getJwt.js';

const jwt = await getJwt();

describe('Stat routes (no logged)', () => {

  it('GET /stat/cards-count should return 401', () => request(app)
    .get('/stat/cards-count')
    .expect(401));

  it('GET /stat/cards-count-by-type should return 401', () => request(app)
    .get('/stat/cards-count-by-type')
    .expect(401));

  it('GET /stat/total-xp should return 401', () => request(app)
    .get('/stat/total-xp')
    .expect(401));

  it('GET /stat/total-pack-open should return 401', () => request(app)
    .get('/stat/total-pack-open')
    .expect(401));

  it('GET /stat/number-of-pack-open-by-day should return 401', () => request(app)
    .get('/stat/number-of-pack-open-by-day')
    .expect(401));

});

describe('Stat routes (logged)', () => {

  it('GET /stat/cards-count should return 200', () => request(app)
    .get('/stat/cards-count')
    .set('Authorization', `Bearer ${jwt}`)
    .expect(200)
    .then(res => {
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body[0]).toHaveProperty('_id');
      expect(res.body[0]).toHaveProperty('count');
    }));

  it('GET /stat/cards-count-by-type should return 200', () => request(app)
    .get('/stat/cards-count-by-type')
    .set('Authorization', `Bearer ${jwt}`)
    .expect(200)
    .then(res => {
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body[0]).toHaveProperty('_id');
      expect(res.body[0]).toHaveProperty('count');
    }));

  it('GET /stat/total-xp should return 200', () => request(app)
    .get('/stat/total-xp')
    .set('Authorization', `Bearer ${jwt}`)
    .expect(200)
    .then(res => {
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body[0]).toHaveProperty('_id');
      expect(res.body[0]).toHaveProperty('xp');
    }));

  it('GET /stat/total-pack-open should return 200', () => request(app)
    .get('/stat/total-pack-open')
    .set('Authorization', `Bearer ${jwt}`)
    .expect(200)
    .then(res => {
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body[0]).toHaveProperty('totalOpenedPacks');
    }));

  it('GET /stat/number-of-pack-open-by-day should return 200', () => request(app)
    .get('/stat/number-of-pack-open-by-day')
    .set('Authorization', `Bearer ${jwt}`)
    .expect(200)
    .then(res => {
      expect(res.body).toBeInstanceOf(Array);
      if (res.body.length > 0) {
        expect(res.body[0]).toHaveProperty('_id');
        expect(res.body[0]).toHaveProperty('packOpened');
      }
    }));

});
