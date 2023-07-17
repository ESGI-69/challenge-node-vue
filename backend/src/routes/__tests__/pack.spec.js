import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { app } from '../../index.js';
import getJwt from '../../../tests/getJwt.js';
import userService from '../../services/user.js';

const jwt = await getJwt();
const noMoneyJwt = await getJwt('janedoe@example.com', '123456');
const adminJwt = await getJwt('admin@example.com', '123456');

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

describe('Packs list (logged)', () => {
  it('GET /packs/ should return 200 and list packs', () => request(app)
    .get('/packs/')
    .set('Authorization', `Bearer ${jwt}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .then(res => {
      expect(res.body).toBeInstanceOf(Array);
    }));
});

describe('Buy pack (logged)', () => {
  it('POST /packs/buy should return 200 & cost 100g', async () => {
    let balance = 1000;
    let userId;

    // Get user balance
    await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        userId = res.body.id;
      });

    // Set 1000g to user
    await request(app)
      .patch(`/users/${userId}/balance`)
      .set('Authorization', `Bearer ${adminJwt}`)
      .send({ balance })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body.balance).toBe(balance);
      });

    // Buy pack
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

    // Check user balance
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
    await userService.setMoney((await userService.findById(2)).id, 0);

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

describe('Open pack (logged)', () => {
  let allreadyOpenedPackId;

  it('POST /packs/:id/open should return 200 & cards, duplicated ID & refund', async () => {
    let packId;
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
        packId = res.body.pack.id;
        balance -= res.body.cost;
      });

    let refundedAmount;

    await request(app)
      .post(`/packs/${packId}/open`)
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).toHaveProperty('cards');
        expect(res.body).toHaveProperty('refunded');
        expect(res.body).toHaveProperty('duplicateCardIds');
        expect(res.body.cards).toBeInstanceOf(Array);
        expect(res.body.duplicateCardIds).toBeInstanceOf(Array);
        expect(typeof res.body.refunded).toBe('number');
        refundedAmount = res.body.refunded;
        allreadyOpenedPackId = packId;
      });

    await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body.balance).toBe(balance + refundedAmount);
      });
  });

  it('POST /packs/:id/open if allready opened should return 403', () => request(app)
    .post(`/packs/${allreadyOpenedPackId}/open`)
    .set('Authorization', `Bearer ${jwt}`)
    .expect(403)
    .expect('Content-Type', /json/)
    .then(res => {
      expect(res.body).toHaveProperty('code');
      expect(res.body.code).toBe('pack_already_opened');
    }));
});
