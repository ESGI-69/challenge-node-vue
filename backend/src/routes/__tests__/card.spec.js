import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { app } from '../../index.js';
import getJwt from '../../../tests/getJwt.js';

const card =  {
  name: 'Card name',
  description: 'Card description',
  image: 'https://via.placeholder.com/150',
  cost: 2,
  rarity: 'common',
  type: 'minion',
  attack: 2,
  health: 2
};

const updatedCard = {
  name: 'New name',
  description: 'New description',
  image: 'https://via.placeholder.com/150',
  type: 'new type',
  rarity: 'rare',
  cost: 6,
  attack: 2,
  health: 2
};

let cardId;
const playerToken = await getJwt('janedoe@example.com', '123456');
const adminToken = await getJwt('admin@example.com', '123456');

describe('Adding a Card as an Admin', () => {
  it('POST /cards/ should create a new card', (done) => {
    request(app)
      .post('/cards/')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(card)
      .expect(201)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(typeof response.body.id).toBe('number');
        cardId = response.body.id;
        expect(response.body.name).toBe(card.name);
        expect(response.body.description).toBe(card.description);
        expect(response.body.image).toBe(card.image);
        expect(response.body.type).toBe(card.type);
        expect(response.body.rarity).toBe(card.rarity);
        expect(response.body.cost).toBe(card.cost);
        expect(response.body.attack).toBe(card.attack);
        expect(response.body.health).toBe(card.health);
        expect(typeof new Date(response.body.createdAt).toISOString()).toBe('string');
        expect(response.body.createdAt).toBeDefined();
        expect(typeof new Date(response.body.updatedAt).toISOString()).toBe('string');
        expect(response.body.updatedAt).toBeDefined();
        done();
      })
      .catch(done);
  });

  it ('POST /cards/ should return 400 if name is empty', (done) => {
    request(app)
      .post('/cards/')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...card, name: '' })
      .expect(400)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.invalidFields).toContain('name');
        done();
      })
      .catch(done);
  });

  it ('POST /cards/ should return 400 if name is not provided', (done) => {
    const noTitleCard = {...card};
    delete noTitleCard.name;
    request(app)
      .post('/cards/')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(noTitleCard)
      .expect(400)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.missingFields).toContain('name');
        expect(response.body.invalidFields).not.toBeDefined();
        done();
      })
      .catch(done);
  });

  it ('POST /cards/ should return 400 if description is empty', (done) => {
    request(app)
      .post('/cards/')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...card, description: '' })
      .expect(400)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.invalidFields).toContain('description');
        done();
      })
      .catch(done);
  });

  it ('POST /cards/ should return 400 if description is not provided', (done) => {
    const noDescriptionCard = {...card};
    delete noDescriptionCard.description;
    request(app)
      .post('/cards/')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(noDescriptionCard)
      .expect(400)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.missingFields).toContain('description');
        expect(response.body.invalidFields).not.toBeDefined();
        done();
      })
      .catch(done);
  });

  it ('POST /cards/ should return 400 if image is empty', (done) => {
    request(app)
      .post('/cards/')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...card, image: '' })
      .expect(400)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.invalidFields).toContain('image');
        done();
      })
      .catch(done);
  });

  it ('POST /cards/ should return 400 if image is not provided', (done) => {
    const noImageCard = {...card};
    delete noImageCard.image;
    request(app)
      .post('/cards/')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(noImageCard)
      .expect(400)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.missingFields).toContain('image');
        expect(response.body.invalidFields).not.toBeDefined();
        done();
      })
      .catch(done);
  });

});

describe('Adding a card as a Player', () => {

  it('POST /cards/ should return 403', (done) => {
    request(app)
      .post('/cards/')
      .set('Authorization', `Bearer ${playerToken}`)
      .send(card)
      .expect(403)
      .then((response) => {
        expect(response.body).toStrictEqual({});
        done();
      })
      .catch(done);
  });
});

describe('Adding a card as Unlogged ', () => {
  it('POST /cards/ should return 403', (done) => {
    request(app)
      .post('/cards/')
      .send(card)
      .expect(401)
      .then((response) => {
        expect(response.body).toStrictEqual({});
        done();
      })
      .catch(done);
  });
});

describe('Getting Cards and a Card', () => {
  it('GET /cards/ should return an array of cards ', (done) => {
    request(app)
      .get('/cards/')
      .set('Authorization', `Bearer ${playerToken}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        const cardFound = response.body.find((c) => c.id === cardId);
        expect(Array.isArray(response.body)).toBe(true);
        expect(cardFound.name).toBe(card.name);
        expect(cardFound.description).toBe(card.description);
        expect(cardFound.image).toBe(card.image);
        expect(typeof new Date(cardFound.createdAt).toISOString()).toBe('string');
        expect(cardFound.createdAt).toBeDefined();
        expect(typeof new Date(cardFound.updatedAt).toISOString()).toBe('string');
        expect(cardFound.updatedAt).toBeDefined();
        done();
      })
      .catch(done);
  });

  it('GET /cards/:id should return the card added', (done) => {
    request(app)
      .get(`/cards/${cardId}`)
      .set('Authorization', `Bearer ${playerToken}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.name).toBe(card.name);
        expect(response.body.description).toBe(card.description);
        expect(response.body.image).toBe(card.image);
        expect(response.body.type).toBe(card.type);
        expect(response.body.rarity).toBe(card.rarity);
        expect(response.body.cost).toBe(card.cost);
        expect(response.body.attack).toBe(card.attack);
        expect(response.body.health).toBe(card.health);
        expect(typeof new Date(response.body.createdAt).toISOString()).toBe('string');
        expect(response.body.createdAt).toBeDefined();
        expect(typeof new Date(response.body.updatedAt).toISOString()).toBe('string');
        expect(response.body.updatedAt).toBeDefined();
        done();
      })
      .catch(done);
  });
});

describe('Getting Cards as Unlogged', () => {
  it('GET /cards/ should return 401', (done) => {
    request(app)
      .get('/cards/')
      .expect(401)
      .then((response) => {
        expect(response.body).toStrictEqual({});
        done();
      })
      .catch(done);
  });
});

describe('Updating a Card PATCH', () => {
  it('PATCH /cards/:id as an Admin should update the card', (done) => {
    request(app)
      .patch(`/cards/${cardId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({...updatedCard, name: 'New test'})
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(typeof response.body.id).toBe('number');
        expect(response.body.name).toBe('New test');
        expect(response.body.description).toBe(updatedCard.description);
        expect(response.body.image).toBe(updatedCard.image);
        expect(response.body.type).toBe(updatedCard.type);
        expect(response.body.rarity).toBe(updatedCard.rarity);
        expect(response.body.cost).toBe(updatedCard.cost);
        expect(response.body.attack).toBe(updatedCard.attack);
        expect(response.body.health).toBe(updatedCard.health);
        expect(typeof new Date(response.body.createdAt).toISOString()).toBe('string');
        expect(response.body.createdAt).toBeDefined();
        expect(typeof new Date(response.body.updatedAt).toISOString()).toBe('string');
        expect(response.body.updatedAt).toBeDefined();
        done();
      })
      .catch(done);
  });

  it('PATCH /cards/:id as a Player should return 403', (done) => {
    const updatedCard = {
      name: 'New name',
      description: 'New description',
      image: 'https://via.placeholder.com/150'
    };
    request(app)
      .patch(`/cards/${cardId}`)
      .set('Authorization', `Bearer ${playerToken}`)
      .send(updatedCard)
      .expect(403)
      .then((response) => {
        expect(response.body).toStrictEqual({});
        done();
      })
      .catch(done);
  });

  it('PATCH /cards/:id as Unlogged should return 401', (done) => {
    const updatedCard = {
      name: 'New name',
      description: 'New description',
      image: 'https://via.placeholder.com/150'
    };
    request(app)
      .patch(`/cards/${cardId}`)
      .send(updatedCard)
      .expect(401)
      .then((response) => {
        expect(response.body).toStrictEqual({});
        done();
      })
      .catch(done);
  });

  it('PATCH /cards/:id should return 400 if name is empty', (done) => {
    request(app)
      .patch(`/cards/${cardId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...card, name: '' })
      .expect(400)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.invalidFields).toContain('name');
        done();
      })
      .catch(done);
  });

  it('PATCH /cards/:id should return 200 if name is not provided', (done) => {
    const noTitleCard = {...card};
    delete noTitleCard.name;
    request(app)
      .patch(`/cards/${cardId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(noTitleCard)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.invalidFields).not.toBeDefined();
        done();
      })
      .catch(done);
  });
});


describe('Updating a Card PUT', () => {
  it('PUT /cards/:id as an Admin should update the card', (done) => {
    const newCard = {
      ...updatedCard,
      id: cardId,
    };
    request(app)
      .put(`/cards/${cardId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newCard)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.name).toBe(updatedCard.name);
        expect(response.body.description).toBe(updatedCard.description);
        expect(response.body.image).toBe(updatedCard.image);
        expect(response.body.type).toBe(updatedCard.type);
        expect(response.body.rarity).toBe(updatedCard.rarity);
        expect(response.body.cost).toBe(updatedCard.cost);
        expect(response.body.attack).toBe(updatedCard.attack);
        expect(response.body.health).toBe(updatedCard.health);
        expect(typeof new Date(response.body.createdAt).toISOString()).toBe('string');
        expect(response.body.createdAt).toBeDefined();
        expect(typeof new Date(response.body.updatedAt).toISOString()).toBe('string');
        expect(response.body.updatedAt).toBeDefined();
        done();
      })
      .catch(done);
  });

  it('PUT /cards/:id as a Player should return 403', (done) => {
    request(app)
      .put(`/cards/${cardId}`)
      .set('Authorization', `Bearer ${playerToken}`)
      .send(updatedCard)
      .expect(403)
      .then((response) => {
        expect(response.body).toStrictEqual({});
        done();
      })
      .catch(done);
  });

  it('PUT /cards/:id as Unlogged should return 401', (done) => {
    request(app)
      .put(`/cards/${cardId}`)
      .send(updatedCard)
      .expect(401)
      .then((response) => {
        expect(response.body).toStrictEqual({});
        done();
      })
      .catch(done);
  });

  it('PUT /cards/:id should return 400 if name is empty', (done) => {
    const newCard = {
      ...updatedCard,
      id: cardId,
      name: ''
    };
    request(app)
      .put(`/cards/${cardId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newCard)
      .expect(400)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.invalidFields).toContain('name');
        done();
      })
      .catch(done);
  });

  it('PUT /cards/:id should return 400 if name is not provided', (done) => {
    const noTitleCard = {...card};
    delete noTitleCard.name;
    request(app)
      .put(`/cards/${cardId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(noTitleCard)
      .expect(400)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.missingFields).toContain('name');
        expect(response.body.invalidFields).not.toBeDefined();
        done();
      })
      .catch(done);
  });

  it('PUT /cards/:id should return 400 if description is empty', (done) => {
    request(app)
      .put(`/cards/${cardId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...card, description: '' })
      .expect(400)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.invalidFields).toContain('description');
        done();
      })
      .catch(done);
  });

  it('PUT /cards/:id should return 400 if description is not provided', (done) => {
    const noDescriptionCard = {...card};
    delete noDescriptionCard.description;
    request(app)
      .put(`/cards/${cardId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(noDescriptionCard)
      .expect(400)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.missingFields).toContain('description');
        expect(response.body.invalidFields).not.toBeDefined();
        done();
      })
      .catch(done);
  });

  it('PUT /cards/:id should return 400 if image is empty', (done) => {
    request(app)
      .put(`/cards/${cardId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...card, image: '' })
      .expect(400)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.invalidFields).toContain('image');
        done();
      })
      .catch(done);
  });

  it('PUT /cards/:id should return 400 if image is not provided', (done) => {
    const noImageCard = {...card};
    delete noImageCard.image;
    request(app)
      .put(`/cards/${cardId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(noImageCard)
      .expect(400)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.missingFields).toContain('image');
        expect(response.body.invalidFields).not.toBeDefined();
        done();
      })
      .catch(done);
  });
});

describe('Deleting a Card', () => {
  it('DELETE /cards/:id as not logged should return 401', (done) => {
    request(app)
      .delete(`/cards/${cardId}`)
      .expect(401)
      .then((response) => {
        expect(response.body).toStrictEqual({});
        done();
      })
      .catch(done);
  });

  it('DELETE /cards/:id as a Player should return 403', (done) => {
    request(app)
      .delete(`/cards/${cardId}`)
      .set('Authorization', `Bearer ${playerToken}`)
      .expect(403)
      .then((response) => {
        expect(response.body).toStrictEqual({});
        done();
      })
      .catch(done);
  });

  it('DELETE /cards/:id as an Admin should delete the card', (done) => {
    request(app)
      .delete(`/cards/${cardId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(204)
      .then((response) => {
        expect(response.body).toStrictEqual({});
        done();
      })
      .catch(done);
  });
});

