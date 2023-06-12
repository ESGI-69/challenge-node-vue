import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { app } from '../../index.js';
import getJwt from '../../../tests/getJwt.js';

const jwt = await getJwt();

const noMoneyJwt = await getJwt('janedoe@example.com', '123456');

describe('Pack routes (no logged)', () => {
  it('GET /packs/ should return 401', () => request(app)
    .get('/packs/')
    .expect(401));

  it('POST /packs/buy should return 401', () => request(app)
    .post('/packs/buy')
    .expect(401));

  it('POST /packs/:id/open should return 401', () => request(app)
    .post('/packs/1/open')
    .expect(401));
});

describe ('Packs list (logged)', () => {
  it('GET /packs/ should return 200', () => request(app)
    .get('/packs/')
    .set('Authorization', `Bearer ${jwt}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .then(res => {
      expect(res.body).toHaveLength(1);
    }));
});

describe ('Buy pack (logged)', () => {
  it('POST /packs/buy should return 200 & cost 100g', async () => {
    let balance;
    await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        balance = res.body.balance;
      });


    await request(app)
      .post('/packs/buy')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(201)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).toHaveProperty('pack');
        expect(res.body).toHaveProperty('cost');
        expect(res.body.cost).toBe(100);
        expect(res.body.pack).toHaveProperty('id');
      });

    await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body.balance).toBe(balance - 100);
      });
  });

  it('POST /packs/buy if not enough money should return 403', async () => {
    let balance;
    await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${noMoneyJwt}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        balance = res.body.balance;
      });


    await request(app)
      .post('/packs/buy')
      .set('Authorization', `Bearer ${noMoneyJwt}`)
      .expect(403)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).toHaveProperty('code');
        expect(res.body.code).toBe('balance_too_low');
      });

    await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${noMoneyJwt}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body.balance).toBe(balance);
      });
  });
});

describe ('Open pack (logged)', () => {
  it('POST /packs/:id/open should return 200 & 5 cards, duplicated ID & refund', async () => {
    let balance;

    await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        balance = res.body.balance;
      });

    await request(app)
      .post('/packs/1/open')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).toHaveProperty('cards');
        expect(res.body).toHaveProperty('refunded');
        expect(res.body).toHaveProperty('duplicateCardIds');
        expect(res.body.cards).toHaveLength(5);
        expect(res.body.duplicateCardIds).toHaveLength(2);
        expect(res.body.refunded).toBe(20);
      });

    await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body.balance).toBe(balance + 20);
      });
  });

  it('POST /packs/:id/open if allready opened should return 403', () => request(app)
    .post('/packs/1/open')
    .set('Authorization', `Bearer ${jwt}`)
    .expect(403)
    .expect('Content-Type', /json/)
    .then(res => {
      expect(res.body).toHaveProperty('code');
      expect(res.body.code).toBe('pack_already_opened');
    }));
});
