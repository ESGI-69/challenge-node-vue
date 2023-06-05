import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import { app } from '../../index.js';
import getJwt from '../../../tests/getJwt.js';

const user = {
  email: 'test@test.test',
  password: 'Testtest1234!',
  firstname: 'Firstname',
  lastname: 'Lastname',
};

let userId;
let playerToken;
const adminToken = await getJwt('admin@example.com', '123456');

describe('Register flow', () => {
  it('POST /users/ should create a new user', (done) => {
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

  it('POST /users/ should return 400 if email is invalid', (done) => {
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

  it('POST /users/ should return 400 if email is missing', (done) => {
    const noEmailUser = { ...user };
    delete noEmailUser.email;
    request(app)
      .post('/users/')
      .send(noEmailUser)
      .expect(400)
      .expect('Content-Type', /json/)
      .then(async (res) => {
        expect(res.body.missingFields).toContain('email');
        expect(res.body.invalidFields).not.toBeDefined();
        playerToken = await getJwt(user.email, user.password);
        done();
      })
      .catch(done);
  });

  it('GET /users/me should return the user', (done) => {
    request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${playerToken}`)
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
});

describe('User info access (Admin)', () => {
  it('GET /users/ should contain the created user', (done) => {
    request(app)
      .get('/users/')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        const responseUser = res.body.find((u) => u.id === userId);
        expect(typeof responseUser.id).toBe('number');
        expect(responseUser.id).toBe(userId);
        expect(responseUser.email).toBe(user.email);
        expect(responseUser.firstname).toBe(user.firstname);
        expect(responseUser.lastname).toBe(user.lastname);
        expect(responseUser.updatedAt).toBeDefined();
        expect(typeof new Date(responseUser.updatedAt).toISOString()).toBe('string');
        expect(responseUser.createdAt).toBeDefined();
        expect(typeof new Date(responseUser.createdAt).toISOString()).toBe('string');
        expect(responseUser.createdAt).toBe(user.createdAt);
        // TODO: Check if password absent from the response
        done();
      })
      .catch(done);
  });
});

describe('User not authenticated access', () => {
  it('GET /users/ should return 401', (done) => {
    request(app)
      .get('/users/')
      .expect(401)
      .then(() => {
        done();
      })
      .catch(done);
  });

  it('GET /users/:id should return 401', (done) => {
    request(app)
      .get(`/users/${userId}`)
      .expect(401)
      .then(() => {
        done();
      })
      .catch(done);
  });

  it('PUT /users/:id should return 401', (done) => {
    request(app)
      .put(`/users/${userId}`)
      .expect(401)
      .then(() => {
        done();
      })
      .catch(done);
  });

  it('DELETE /users/:id should return 401', (done) => {
    request(app)
      .delete(`/users/${userId}`)
      .expect(401)
      .then(() => {
        done();
      })
      .catch(done);
  });
});

describe('User info access (Player)', () => {
  it('GET /users/ should return 403', (done) => {
    request(app)
      .get('/users/')
      .set('Authorization', `Bearer ${playerToken}`)
      .expect(403)
      .then(() => {
        done();
      })
      .catch(done);
  });

  it('GET /users/:id should return 403', (done) => {
    request(app)
      .get('/users/444')
      .set('Authorization', `Bearer ${playerToken}`)
      .expect(403)
      .then(() => {
        done();
      })
      .catch(done);
  });

  it('PUT /users/:id should return 403', (done) => {
    request(app)
      .put(`/users/${userId}`)
      .set('Authorization', `Bearer ${playerToken}`)
      .expect(403)
      .then(() => {
        done();
      })
      .catch(done);
  });

  it('DELETE /users/:id should return 403', (done) => {
    request(app)
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${playerToken}`)
      .expect(403)
      .then(() => {
        done();
      })
      .catch(done);
  });
});

describe('User Update flow (Admin)', () => {
  it('PUT /users/:id should update a user', (done) => {
    const updatedUser = {
      email: 'test1@test.test',
      password: user.password,
      firstname: user.firstname,
      lastname: user.lastname,
    };
    request(app)
      .put(`/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
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

  const updatedUser = {
    email: 'test2@test.test',
  };

  it('PATCH /users/:id should update a user with a new email', (done) => {
    request(app)
      .patch(`/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
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

  it('PATCH /users/:id that does not exist should return 404', (done) => {
    const failUpdatedUser = {
      email: 'test123@test.test',
    };
    request(app)
      .patch('/users/999998')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(failUpdatedUser)
      .expect(404)
      .then(() => {
        done();
      })
      .catch(done);
  });

  it('GET /users/ should contain the updated user', (done) => {
    request(app)
      .get('/users/')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        const responseUser = res.body.find((u) => u.id === userId);
        expect(typeof responseUser.id).toBe('number');
        expect(responseUser.email).toBe(updatedUser.email);
        expect(user.firstname).toBe(responseUser.firstname);
        expect(user.lastname).toBe(responseUser.lastname);
        expect(responseUser.updatedAt).toBeDefined();
        expect(typeof new Date(responseUser.updatedAt).toISOString()).toBe('string');
        expect(responseUser.createdAt).toBeDefined();
        expect(typeof new Date(responseUser.createdAt).toISOString()).toBe('string');
        expect(user.createdAt).toBe(responseUser.createdAt);
        // TODO: Check if password absent from the response
        done();
      })
      .catch(done);
  });
});

describe('User Delete flow (Admin)', () => {
  it('DELETE /users/:id should delete a user', (done) => {
    request(app)
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(204)
      .then(() => {
        done();
      })
      .catch(done);
  });

  it('DELETE /users/:id that does not exist should return 404', (done) => {
    request(app)
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404)
      .then(() => {
        done();
      })
      .catch(done);
  });

  it('GET /users/ should not contain the deleted user', (done) => {
    request(app)
      .get('/users/')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        const user = res.body.find((u) => u.id === userId);
        expect(user).toBeUndefined();
        done();
      })
      .catch(done);
  });

  it('GET /users/:id should return 404', (done) => {
    request(app)
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404)
      .then(() => {
        done();
      })
      .catch(done);
  });
});
