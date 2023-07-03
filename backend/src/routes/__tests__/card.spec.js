import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { app } from '../../index.js';
import getJwt from '../../../tests/getJwt.js';

const card =  {
  name: 'Card name',
  description: 'Card description',
  cost: 2,
  rarity: 'common',
  type: 'minion',
  attack: 2,
  health: 2,
};

const updatedCard = {
  name: 'New name',
  description: 'New description',
  type: 'new type',
  rarity: 'rare',
  cost: 6,
  attack: 2,
  health: 2,
};

let cardId;
const playerToken = await getJwt('janedoe@example.com', '123456');
const adminToken = await getJwt('admin@example.com', '123456');

describe('Adding a Card as an Admin', () => {
  it('POST /cards/ should create a new card', () => request(app)
    .post('/cards/')
    .set('Authorization', `Bearer ${adminToken}`)
    .field('name', card.name)
    .field('description', card.description)
    .field('cost', card.cost)
    .field('rarity', card.rarity)
    .field('type', card.type)
    .field('attack', card.attack)
    .field('health', card.health)
    .attach('image', 'tests/assets/card.png')
    .expect(201)
    .expect('Content-Type', /json/)
    .then((response) => {
      expect(typeof response.body.id).toBe('number');
      cardId = response.body.id;
      expect(response.body.name).toBe(card.name);
      expect(response.body.description).toBe(card.description);
      expect(response.body.type).toBe(card.type);
      expect(response.body.rarity).toBe(card.rarity);
      expect(response.body.cost).toBe(card.cost);
      expect(response.body.attack).toBe(card.attack);
      expect(response.body.health).toBe(card.health);
      expect(typeof new Date(response.body.createdAt).toISOString()).toBe('string');
      expect(response.body.createdAt).toBeDefined();
      expect(typeof new Date(response.body.updatedAt).toISOString()).toBe('string');
      expect(response.body.updatedAt).toBeDefined();
      expect(response.body.image).toBeUndefined();
    }));

  it('POST /cards/ should return 400 if name is empty', () => request(app)
    .post('/cards/')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ ...card, name: '' })
    .expect(400)
    .expect('Content-Type', /json/)
    .then((response) => {
      expect(response.body.invalidFields).toContain('name');
    }));

  it('POST /cards/ should return 400 if name is not provided', async () => {
    const noTitleCard = { ...card };
    delete noTitleCard.name;
    await request(app)
      .post('/cards/')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(noTitleCard)
      .expect(400)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.missingFields).toContain('name');
        expect(response.body.invalidFields).not.toBeDefined();
      });
  });

  it('POST /cards/ should return 400 if description is empty', () => request(app)
    .post('/cards/')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ ...card, description: '' })
    .expect(400)
    .expect('Content-Type', /json/)
    .then((response) => {
      expect(response.body.invalidFields).toContain('description');
    }));

  it('POST /cards/ should return 400 if description is not provided', async () => {
    const noDescriptionCard = { ...card };
    delete noDescriptionCard.description;
    await request(app)
      .post('/cards/')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(noDescriptionCard)
      .expect(400)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.missingFields).toContain('description');
        expect(response.body.invalidFields).not.toBeDefined();
      });
  });

  it('POST /cards/ should return 400 if image is empty', () => request(app)
    .post('/cards/')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ ...card, image: '' })
    .expect(400)
    .expect('Content-Type', /json/)
    .then((response) => {
      expect(response.body.invalidFields).toContain('image');
    }));

  it('POST /cards/ should return 400 if image is not provided', async () => {
    const noImageCard = { ...card };
    delete noImageCard.image;
    await request(app)
      .post('/cards/')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(noImageCard)
      .expect(400)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.missingFields).toContain('image');
        expect(response.body.invalidFields).not.toBeDefined();
      });
  });

});

describe('Adding a card as a Player', () => {
  it('POST /cards/ should return 403', () => request(app)
    .post('/cards/')
    .set('Authorization', `Bearer ${playerToken}`)
    .send(card)
    .expect(403)
    .then((response) => {
      expect(response.body).toStrictEqual({});
    }));
});

describe('Adding a card as Unlogged ', () => {
  it('POST /cards/ should return 403', () => request(app)
    .post('/cards/')
    .send(card)
    .expect(401)
    .then((response) => {
      expect(response.body).toStrictEqual({
        code: 'not_logged_in',
        message: 'Not logged in',
      });
    }));
});

describe('Getting Cards and a Card', () => {
  it('GET /cards/ as player should return a 403', () => request(app)
    .get('/cards/')
    .set('Authorization', `Bearer ${playerToken}`)
    .expect(403));

  it('GET /cards/ as admin should return an array of cards', () => request(app)
    .get('/cards/')
    .set('Authorization', `Bearer ${adminToken}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((response) => {
      const cardFound = response.body.find((c) => c.id === cardId);
      expect(Array.isArray(response.body)).toBe(true);
      expect(cardFound.name).toBe(card.name);
      expect(cardFound.description).toBe(card.description);
      expect(cardFound.type).toBe(card.type);
      expect(cardFound.rarity).toBe(card.rarity);
      expect(cardFound.cost).toBe(card.cost);
      expect(cardFound.attack).toBe(card.attack);
      expect(cardFound.health).toBe(card.health);
      expect(cardFound.image).toBeUndefined();
      expect(cardFound.createdAt).toBeUndefined();
      expect(cardFound.updatedAt).toBeUndefined();
    }));

  it('GET /cards/:id should return the card added', () => request(app)
    .get(`/cards/${cardId}`)
    .set('Authorization', `Bearer ${playerToken}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((response) => {
      expect(response.body.name).toBe(card.name);
      expect(response.body.description).toBe(card.description);
      expect(response.body.type).toBe(card.type);
      expect(response.body.rarity).toBe(card.rarity);
      expect(response.body.cost).toBe(card.cost);
      expect(response.body.attack).toBe(card.attack);
      expect(response.body.health).toBe(card.health);
      expect(response.body.createdAt).toBeUndefined();
      expect(response.body.updatedAt).toBeUndefined();
      expect(response.body.image).toBeUndefined();
    }));

  it('GET /cards/:id should return 404 if the card does not exist', () => request(app)
    .get('/cards/999999')
    .set('Authorization', `Bearer ${playerToken}`)
    .expect(404));

  it('GET /cards/:id/image should return the image of the card', () => request(app)
    .get(`/cards/${cardId}/image`)
    .set('Authorization', `Bearer ${playerToken}`)
    .expect(200)
    .expect('Content-Type', 'application/octet-stream'));
});

describe('Getting Cards as Unlogged', () => {
  it('GET /cards/ should return 401', () => request(app)
    .get('/cards/')
    .expect(401)
    .then((response) => {
      expect(response.body).toStrictEqual({
        code: 'not_logged_in',
        message: 'Not logged in',
      });
    }));
});

describe('Updating a Card PATCH', () => {
  it('PATCH /cards/:id as an Admin should update the card', () => request(app)
    .patch(`/cards/${cardId}`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ ...updatedCard, name: 'New test' })
    .expect(200)
    .expect('Content-Type', /json/)
    .then((response) => {
      expect(typeof response.body.id).toBe('number');
      expect(response.body.name).toBe('New test');
      expect(response.body.description).toBe(updatedCard.description);
      expect(response.body.type).toBe(updatedCard.type);
      expect(response.body.rarity).toBe(updatedCard.rarity);
      expect(response.body.cost).toBe(updatedCard.cost);
      expect(response.body.attack).toBe(updatedCard.attack);
      expect(response.body.health).toBe(updatedCard.health);
      expect(typeof new Date(response.body.createdAt).toISOString()).toBe('string');
      expect(response.body.createdAt).toBeDefined();
      expect(typeof new Date(response.body.updatedAt).toISOString()).toBe('string');
      expect(response.body.updatedAt).toBeDefined();
      expect(response.body.image).toBeUndefined();
    }));

  it('PATCH /cards/:id as a Player should return 403', async () => {
    const updatedCard = {
      name: 'New name',
      description: 'New description',
    };
    await request(app)
      .patch(`/cards/${cardId}`)
      .set('Authorization', `Bearer ${playerToken}`)
      .send(updatedCard)
      .expect(403)
      .then((response) => {
        expect(response.body).toStrictEqual({});
      });
  });

  it('PATCH /cards/:id as Unlogged should return 401', async () => {
    const updatedCard = {
      name: 'New name',
      description: 'New description',
    };
    await request(app)
      .patch(`/cards/${cardId}`)
      .send(updatedCard)
      .expect(401)
      .then((response) => {
        expect(response.body).toStrictEqual({
          code: 'not_logged_in',
          message: 'Not logged in',
        });
      });
  });

  it('PATCH /cards/:id should return 400 if name is empty', () => request(app)
    .patch(`/cards/${cardId}`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ ...card, name: '' })
    .expect(400)
    .expect('Content-Type', /json/)
    .then((response) => {
      expect(response.body.invalidFields).toContain('name');
    }));

  it('PATCH /cards/:id should return 200 if name is not provided', async () => {
    const noTitleCard = { ...card };
    delete noTitleCard.name;
    await request(app)
      .patch(`/cards/${cardId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(noTitleCard)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.invalidFields).not.toBeDefined();
      });
  });
});

describe('Deleting a Card', () => {
  it('DELETE /cards/:id as not logged should return 401', () => request(app)
    .delete(`/cards/${cardId}`)
    .expect(401)
    .then((response) => {
      expect(response.body).toStrictEqual({
        code: 'not_logged_in',
        message: 'Not logged in',
      });
    }));

  it('DELETE /cards/:id as a Player should return 403', () => request(app)
    .delete(`/cards/${cardId}`)
    .set('Authorization', `Bearer ${playerToken}`)
    .expect(403)
    .then((response) => {
      expect(response.body).toStrictEqual({});
    }));

  it('DELETE /cards/:id as an Admin should delete the card', () => request(app)
    .delete(`/cards/${cardId}`)
    .set('Authorization', `Bearer ${adminToken}`)
    .expect(204)
    .then((response) => {
      expect(response.body).toStrictEqual({});
    }));
});

