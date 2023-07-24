import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { app } from '../../index.js';
import jwt from 'jsonwebtoken';

/**
 * A user object with valid credentials previously seeded in the database
 */
const user = {
  email: 'johndoe@example.com',
  password: '123456',
};

const unverifiedUser = {
  email: 'unverified@mail.com',
  password: '123456',
};

/**
 * JWT token for the user
 * @type {string}
 */
let token;

describe('Login userflow', () => {
  it('POST /login should return 401 if user does not exist', (done) => {
    request(app)
      .post('/login')
      .send({ email: 'notexist@mail.zug', password: 'Testtest1234!' })
      .expect(401)
      .then((res) => {
        expect(res.body).toEqual({
          code: 'invalid_credentials',
          message: 'Invalid credentials',
        });
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
        expect(res.body).toEqual({
          code: 'invalid_credentials',
          message: 'Invalid credentials',
        });
        done();
      })
      .catch(done);
  });

  it('POST /login should return 401 if email is not verified', (done) => {
    request(app)
      .post('/login')
      .send({ email: unverifiedUser.email, password: unverifiedUser.password })
      .expect(401)
      .then((res) => {
        expect(res.body).toEqual({
          code: 'email_not_validated',
          message: 'Email not validated',
        });
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
        token = res.body.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        delete decoded.iat;
        delete decoded.exp;
        user.id = decoded.id;
        expect(Object.keys(decoded)).toEqual(['id', 'role']);
        done();
      })
      .catch(done);
  });

  it('GET /users/me should return the correct info about the user', (done) => {
    request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((res) => {
        expect(res.body.id).toBe(user.id);
        expect(res.body.email).toBe(user.email);
        expect(res.body.firstname).toBe('John');
        expect(res.body.lastname).toBe('Doe');
        expect(res.body.updatedAt).toBeDefined();
        expect(typeof new Date(res.body.updatedAt).toISOString()).toBe('string');
        expect(res.body.createdAt).toBeDefined();
        expect(typeof new Date(res.body.createdAt).toISOString()).toBe('string');
        // TODO: Check if password absent from the response
        done();
      })
      .catch(done);
  });
});
