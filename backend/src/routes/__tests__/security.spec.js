import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import { app } from '../../index.js';
import jwt from 'jsonwebtoken';

describe('Security endpoints', () => {
  it('POST /login should return 401 if user does not exist', (done) => {
    request(app)
      .post('/login')
      .send({ email: 'notexist@mail.zug', password: 'Testtest1234!' })
      .expect(401)
      .then((res) => {
        expect(res.body).toEqual({});
        done();
      })
      .catch(done);
  });

  // TODO: remove this test when we have seeders
  const user = {
    firstname: 'Gatien',
    lastname: 'Leboss',
    email: 'gatienekeleboss@mail.com',
    password: 'Testtest1234!',
  };

  // TODO: remove this test when we have seeders
  it('POST /users create a new user for test purpose', (done) => {
    request(app)
      .post('/users')
      .send(user)
      .expect(201)
      .then((res) => {
        expect(res.body.id).toBeDefined();
        user.id = res.body.id;
        done();
      })
      .catch(done);
  });

  it('POST /login should return 401 if password is wrong', (done) => {
    request(app)
      .post('/login')
      .send({ email: user.email, password: 'wrongpassword' })
      .expect(401)
      .then((res) => {
        expect(res.body).toEqual({});
        done();
      })
      .catch(done);
  });

  it('POST /login should return 200 and a token with the user ID if credentials are valid', (done) => {
    request(app)
      .post('/login')
      .send({ email: user.email, password: user.password })
      .expect(200)
      .then((res) => {
        expect(res.body.token).toBeDefined();
        const token = res.body.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        delete decoded.iat;
        delete decoded.exp;
        expect(decoded.id).toEqual(user.id);
        expect(Object.keys(decoded)).toEqual(['id']);
        done();
      })
      .catch(done);
  });

  // TODO: remove this test when we have seeders
  it('DELETE /users/:id should return 204', () => request(app)
    .delete(`/users/${user.id}`)
    .expect(204)
  );
});
