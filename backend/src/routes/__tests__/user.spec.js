import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import { app } from '../../index.js';


describe('endpoint /users', () => {
  const user = {
    email: 'test@test.test',
    password: 'Testtest1234!',
    firstname: 'Firstname',
    lastname: 'Lastname',
  };

  let userId;

  it('GET / should return 0 users', (done) => {
    request(app)
      .get('/users/')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.body).toHaveLength(0);
        done();
      })
      .catch(done);
  });

  it('POST / should create a new user', (done) => {
    request(app)
      .post('/users/')
      .send(user)
      .expect(201)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(typeof res.body.id).toBe('number');
        userId = res.body.id;
        expect(res.body.email).toBe(user.email);
        expect(res.body.firstname).toBe(user.firstname);
        expect(res.body.lastname).toBe(user.lastname);
        expect(res.body.updatedAt).toBeDefined();
        expect(typeof new Date(res.body.updatedAt).toISOString()).toBe('string');
        expect(res.body.createdAt).toBeDefined();
        expect(typeof new Date(res.body.createdAt).toISOString()).toBe('string');
        user.createdAt = res.body.createdAt;
        // TODO: Check if password absent from the response
        done();
      })
      .catch(done);
  });

  it('POST / should return 400 if email is invalid', (done) => {
    request(app)
      .post('/users/')
      .send({ ...user, email: 'invalid' })
      .expect(400)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.body.invalidFields).toContain('email');
        expect(res.body.missingFields).not.toBeDefined();
        done();
      })
      .catch(done);
  });

  it('POST / should return 400 if email is missing', (done) => {
    const noEmailUser = { ...user };
    delete noEmailUser.email;
    request(app)
      .post('/users/')
      .send(noEmailUser)
      .expect(400)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.body.missingFields).toContain('email');
        expect(res.body.invalidFields).not.toBeDefined();
        done();
      })
      .catch(done);
  });

  it('GET / should return only the created user', (done) => {
    request(app)
      .get('/users/')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.body).toHaveLength(1);
        const user = res.body[0];
        expect(typeof user.id).toBe('number');
        expect(user.id).toBe(userId);
        expect(user.email).toBe(user.email);
        expect(user.firstname).toBe(user.firstname);
        expect(user.lastname).toBe(user.lastname);
        expect(user.updatedAt).toBeDefined();
        expect(typeof new Date(user.updatedAt).toISOString()).toBe('string');
        expect(user.createdAt).toBeDefined();
        expect(typeof new Date(user.createdAt).toISOString()).toBe('string');
        expect(user.createdAt).toBe(user.createdAt);
        // TODO: Check if password absent from the response
        done();
      })
      .catch(done);
  });

  it('GET /:id should return a user', (done) => {
    request(app)
      .get(`/users/${userId}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(typeof res.body.id).toBe('number');
        expect(res.body.email).toBe(user.email);
        expect(res.body.firstname).toBe(user.firstname);
        expect(res.body.lastname).toBe(user.lastname);
        expect(res.body.updatedAt).toBeDefined();
        expect(typeof new Date(res.body.updatedAt).toISOString()).toBe('string');
        expect(res.body.createdAt).toBeDefined();
        expect(typeof new Date(res.body.createdAt).toISOString()).toBe('string');
        expect(res.body.createdAt).toBe(user.createdAt);
        // TODO: Check if password absent from the response
        done();
      })
      .catch(done);
  });

  it('GET /:id that does not exist should return 404', (done) => {
    request(app)
      .get('/users/999997')
      .expect(404)
      .then(() => {
        done();
      })
      .catch(done);
  });

  it('PUT /:id should update a user', (done) => {
    const updatedUser = {
      email: 'test1@test.test',
      password: user.password,
      firstname: user.firstname,
      lastname: user.lastname,
    };
    request(app)
      .put(`/users/${userId}`)
      .send(updatedUser)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(typeof res.body.id).toBe('number');
        expect(res.body.email).toBe(updatedUser.email);
        expect(res.body.firstname).toBe(updatedUser.firstname);
        expect(res.body.lastname).toBe(updatedUser.lastname);
        expect(res.body.updatedAt).toBeDefined();
        expect(typeof new Date(res.body.updatedAt).toISOString()).toBe('string');
        expect(res.body.createdAt).toBeDefined();
        expect(typeof new Date(res.body.createdAt).toISOString()).toBe('string');
        user.createdAt = res.body.createdAt;
        // TODO: Check if password absent from the response
        done();
      })
      .catch(done);
  });

  it('PATCH /:id should update a user with a new email', (done) => {
    const updatedUser = {
      email: 'test2@test.test',
    };
    request(app)
      .patch(`/users/${userId}`)
      .send(updatedUser)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(typeof res.body.id).toBe('number');
        expect(res.body.email).toBe(updatedUser.email);
        expect(res.body.firstname).toBe(user.firstname);
        expect(res.body.lastname).toBe(user.lastname);
        expect(res.body.updatedAt).toBeDefined();
        expect(typeof new Date(res.body.updatedAt).toISOString()).toBe('string');
        expect(res.body.createdAt).toBeDefined();
        expect(typeof new Date(res.body.createdAt).toISOString()).toBe('string');
        expect(res.body.createdAt).toBe(user.createdAt);
        // TODO: Check if password absent from the response
        done();
      })
      .catch(done);
  });

  it('PATCH /:id that does not exist should return 404', (done) => {
    const updatedUser = {
      email: 'test123@test.test',
    };
    request(app)
      .patch('/users/999998')
      .send(updatedUser)
      .expect(404)
      .then(() => {
        done();
      })
      .catch(done);
  });

  it('DELETE /:id should delete a user', (done) => {
    request(app)
      .delete(`/users/${userId}`)
      .expect(204)
      .then(() => {
        done();
      })
      .catch(done);
  });

  it('DELETE /:id that does not exist should return 404', (done) => {
    request(app)
      .delete('/users/999995')
      .expect(404)
      .then(() => {
        done();
      })
      .catch(done);
  });

  it('GET / should return 0 users', (done) => {
    request(app)
      .get('/users/')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.body).toHaveLength(0);
        done();
      })
      .catch(done);
  });

  it('GET /:id should return 404', (done) => {
    request(app)
      .get(`/users/${userId}`)
      .expect(404)
      .then(() => {
        done();
      })
      .catch(done);
  });
});
