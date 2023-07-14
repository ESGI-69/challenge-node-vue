import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { app } from '../../index.js';
import getJwt from '../../../tests/getJwt.js';

const baseProduct = {
  id: 1,
  name: '11000 Coins',
  price: 10,
  categorie: 'COINS',
  value: 11000,
};

const newProduct = {
  name: 'Test Product',
  price: 100,
  categorie: 'COINS',
  value: 110000,
};

const updatedProduct = {
  name: 'Updated Test Product',
  price: 200,
  categorie: 'COINS',
  value: 220000,
};

let newProductId;
const playerToken = await getJwt('janedoe@example.com', '123456');
const adminToken = await getJwt('admin@example.com', '123456');

describe('As an User/Player ', () => {
  it('GET /products should return 200', () => request(app)
    .get('/products')
    .set('Authorization', `Bearer ${playerToken}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((response) => {
      const productFound = response.body.find((c) => c.id === baseProduct.id);
      expect(productFound.name).toBe(baseProduct.name);
      expect(productFound.price).toBe(baseProduct.price);
      expect(productFound.categorie).toBe(baseProduct.categorie);
      expect(productFound.value).toBe(baseProduct.value);
    }),
  );

  it('GET /products/:id should return 200', () => request(app)
    .get(`/products/${baseProduct.id}`)
    .set('Authorization', `Bearer ${playerToken}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((response) => {
      expect(response.body.name).toBe(baseProduct.name);
      expect(response.body.price).toBe(baseProduct.price);
      expect(response.body.categorie).toBe(baseProduct.categorie);
      expect(response.body.value).toBe(baseProduct.value);
    }),
  );

  it('POST /products should return 403', () => request(app)
    .post('/products')
    .set('Authorization', `Bearer ${playerToken}`)
    .send(newProduct)
    .expect(403)
    .then((response) => {
      expect(response.body).toStrictEqual({});
    }),
  );

  it('PATCH /products/:id should return 403', () => request(app)
    .patch(`/products/${baseProduct.id}`)
    .set('Authorization', `Bearer ${playerToken}`)
    .send(updatedProduct)
    .expect(403)
    .then((response) => {
      expect(response.body).toStrictEqual({});
    }),
  );

  it('DELETE /products/:id should return 403', () => request(app)
    .delete(`/products/${baseProduct.id}`)
    .set('Authorization', `Bearer ${playerToken}`)
    .expect(403)
    .then((response) => {
      expect(response.body).toStrictEqual({});
    }),
  );
});

describe('As an Unlogged User ', () => {
  it('GET /products should return 401', () => request(app)
    .get('/products')
    .expect(401)
    .then((response) => {
      expect(response.body).toStrictEqual({
        code: 'not_logged_in',
        message: 'Not logged in',
      });
    }),
  );

  it('GET /products/:id should return 401', () => request(app)
    .get(`/products/${baseProduct.id}`)
    .expect(401)
    .then((response) => {
      expect(response.body).toStrictEqual({
        code: 'not_logged_in',
        message: 'Not logged in',
      });
    }),
  );

  it('POST /products should return 401', () => request(app)
    .post('/products')
    .send(newProduct)
    .expect(401)
    .then((response) => {
      expect(response.body).toStrictEqual({
        code: 'not_logged_in',
        message: 'Not logged in',
      });
    }),
  );

  it('PATCH /products/:id should return 401', () => request(app)
    .patch(`/products/${baseProduct.id}`)
    .send(updatedProduct)
    .expect(401)
    .then((response) => {
      expect(response.body).toStrictEqual({
        code: 'not_logged_in',
        message: 'Not logged in',
      });
    }),
  );

  it('DELETE /products/:id should return 401', () => request(app)
    .delete(`/products/${baseProduct.id}`)
    .expect(401)
    .then((response) => {
      expect(response.body).toStrictEqual({
        code: 'not_logged_in',
        message: 'Not logged in',
      });
    }),
  );
});

describe('As an Admin ', () => {
  it('GET /products/:id should return 200', () => request(app)
    .get(`/products/${baseProduct.id}`)
    .set('Authorization', `Bearer ${adminToken}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((response) => {
      expect(response.body.name).toBe(baseProduct.name);
      expect(response.body.price).toBe(baseProduct.price);
      expect(response.body.categorie).toBe(baseProduct.categorie);
      expect(response.body.value).toBe(baseProduct.value);
    }),
  );

  it('POST /products should return 201', () => request(app)
    .post('/products')
    .set('Authorization', `Bearer ${adminToken}`)
    .send(newProduct)
    .expect(201)
    .expect('Content-Type', /json/)
    .then((response) => {
      newProductId = response.body.id;
      expect(response.body.name).toBe(newProduct.name);
      expect(response.body.price).toBe(newProduct.price);
      expect(response.body.categorie).toBe(newProduct.categorie);
      expect(response.body.value).toBe(newProduct.value);
    }),
  );

  it('POST /products should return 422 if fields', async () => {
    const productWithMissingFields = { ...newProduct };
    delete productWithMissingFields.name;
    delete productWithMissingFields.price;
    await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(productWithMissingFields)
      .expect(422)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.missingFields).toContain('name');
        expect(response.body.missingFields).toContain('price');
      });
  });

  it('POST /products should return 422 if fields are not valid', async () => {
    const productWithInvalidFields = { ...newProduct, name: '' };
    await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(productWithInvalidFields)
      .expect(422)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.invalidFields).toContain('name');
      });
  });

  it('GET /products should return 200 and the products created', () => request(app)
    .get('/products')
    .set('Authorization', `Bearer ${adminToken}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((response) => {
      const productFound = response.body.find((c) => c.id === newProductId);
      expect(productFound.name).toBe(newProduct.name);
      expect(productFound.price).toBe(newProduct.price);
      expect(productFound.categorie).toBe(newProduct.categorie);
      expect(productFound.value).toBe(newProduct.value);
    }),
  );

  it('PATCH /products/:id should return 200', () => request(app)
    .patch(`/products/${newProductId}`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send(updatedProduct)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((response) => {
      expect(response.body.name).toBe(updatedProduct.name);
      expect(response.body.price).toBe(updatedProduct.price);
      expect(response.body.categorie).toBe(updatedProduct.categorie);
      expect(response.body.value).toBe(updatedProduct.value);
    }),
  );

  it('DELETE /products/:id should return 204', () => request(app)
    .delete(`/products/${newProductId}`)
    .set('Authorization', `Bearer ${adminToken}`)
    .expect(204)
    .then((response) => {
      expect(response.body).toStrictEqual({});
    }),
  );

});
