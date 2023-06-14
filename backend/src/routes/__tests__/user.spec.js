import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import request from 'supertest';
import { app } from '../../index.js';
import getJwt from '../../../tests/getJwt.js';
import removeUser from '../../../tests/removeUser.js';
import fs from 'fs';
import mailer from '../../utils/mailer.js';

const user = {
  email: 'usernewtest@test.test',
  password: 'Testtest1234!',
  firstname: 'Firstname',
  lastname: 'Lastname',
};

// create a new avatar file
const avatar = fs.createReadStream('./tests/assets/avatar.png');

const userWithAvatar = {
  ...user,
  email: 'testavatar@test.test',
  avatar,
};

let avatarJwt;

let userId;
let playerToken;
let userEmailToken;
const adminToken = await getJwt('admin@example.com', '123456');

describe('Register flow', () => {
  let mailerSendMailMock;

  beforeAll(() => {
    mailerSendMailMock = jest.spyOn(mailer, 'sendMail').mockResolvedValue();
  });

  afterAll(() => {
    mailerSendMailMock.mockRestore();
  });

  it('POST /users/ should create a new user', (done) => {
    request(app)
      .post('/users/')
      .send(user)
      .expect(201)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(typeof res.body.id).toBe('number');
        userId = res.body.id;
        userEmailToken = res.body.mailToken;
        expect(res.body.email).toBe(user.email);
        expect(res.body.firstname).toBe(user.firstname);
        expect(res.body.lastname).toBe(user.lastname);
        expect(res.body.updatedAt).toBeDefined();
        expect(typeof new Date(res.body.updatedAt).toISOString()).toBe('string');
        expect(res.body.createdAt).toBeDefined();
        expect(typeof new Date(res.body.createdAt).toISOString()).toBe('string');
        user.createdAt = res.body.createdAt;
        expect(res.body.password).toBeUndefined();
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
        done();
      })
      .catch(done);
  });

  it('POST /users/confirm should confirm the user', (done) => {
    console.log('userEmailToken', userEmailToken);
    request(app)
      .post('/users/confirm')
      .send({ mailToken: userEmailToken })
      .expect(200)
      .then(async () => {
        playerToken = await getJwt(user.email, user.password);
        done();
      })
      .catch(done);
  });

  it('GET /users/me should return the user', (done) => {
    console.log(playerToken);
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
        expect(res.body.password).toBeUndefined();
        done();
      })
      .catch(done);
  });
});

describe('User register with avatar', () => {
  let avatarUserId;
  let avatarEmailToken;

  let mailerSendMailMock;

  beforeAll(() => {
    mailerSendMailMock = jest.spyOn(mailer, 'sendMail').mockResolvedValue();
  });

  afterAll(() => {
    mailerSendMailMock.mockRestore();
  });

  it('POST /users/ should create a new user with avatar', (done) => {
    const req = request(app)
      .post('/users/');

    Object.keys(userWithAvatar).forEach((key) => {
      req.field(key, userWithAvatar[key]);
    });

    req
      .expect(201)
      .expect('Content-Type', /json/)
      .then(async (res) => {
        expect(typeof res.body.id).toBe('number');
        avatarUserId = res.body.id;
        avatarEmailToken = res.body.mailToken;
        expect(res.body.avatar).toBeUndefined();
        done();
      })
      .catch(done);
  });

  it ('POST /users/confirm should confirm the user', (done) => {
    request(app)
      .post('/users/confirm')
      .send({ mailToken: avatarEmailToken })
      .expect(200)
      .then(async () => {
        avatarJwt = await getJwt(userWithAvatar.email, userWithAvatar.password);
        done();
      })
      .catch(done);
  });

  it('GET /users/me/avatar should return an image', () => request(app)
    .get('/users/me/avatar')
    .auth(avatarJwt, { type: 'bearer' })
    .expect(200)
    .expect('Content-Type', 'application/octet-stream'));

  afterAll(() => {
    removeUser(avatarUserId);
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
        expect(responseUser.password).not.toBeDefined();
        done();
      })
      .catch(done);
  });
});

describe('User not authenticated access', () => {
  it('GET /users/ should return ', () => request(app)
    .get('/users/')
    .expect(401));

  it('GET /users/:id should return ', () => request(app)
    .get(`/users/${userId}`)
    .expect(401));

  it('GET /users/:id/avatar should return 401', () => request(app)
    .get(`/users/${userId}/avatar`)
    .expect(401));

  it('GET /users/me should return ', () => request(app)
    .get('/users/me')
    .expect(401));

  it('GET /users/me/avatar should return ', () => request(app)
    .get('/users/me/avatar')
    .expect(401));

  it('PUT /users/:id should return ', () => request(app)
    .put(`/users/${userId}`)
    .expect(401));

  it('DELETE /users/:id should return ', () => request(app)
    .delete(`/users/${userId}`)
    .expect(401));
});

describe('User info access (Player)', () => {
  it('GET /users/ should return 403', () => request(app)
    .get('/users/')
    .set('Authorization', `Bearer ${playerToken}`)
    .expect(403));

  it('GET /users/:id should return 403', () => request(app)
    .get('/users/444')
    .set('Authorization', `Bearer ${playerToken}`)
    .expect(403));

  it('PUT /users/:id should return 403', () => request(app)
    .put(`/users/${userId}`)
    .set('Authorization', `Bearer ${playerToken}`)
    .expect(403));

  it('DELETE /users/:id should return 403', () => request(app)
    .delete(`/users/${userId}`)
    .set('Authorization', `Bearer ${playerToken}`)
    .expect(403));
});

describe('User Update flow (Admin)', () => {
  let mailerSendMailMock;

  beforeAll(() => {
    mailerSendMailMock = jest.spyOn(mailer, 'sendMail').mockResolvedValue();
  });

  afterAll(() => {
    mailerSendMailMock.mockRestore();
  });

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
        expect(res.body.password).toBeUndefined();
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
        expect(res.body.password).toBeUndefined();
        done();
      })
      .catch(done);
  });

  it('PATCH /users/:id that does not exist should return 404', () => request(app)
    .patch('/users/999998')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ email: 'test123@test.test' })
    .expect(404));

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
        expect(responseUser.password).toBeUndefined();
        done();
      })
      .catch(done);
  });
});

describe('User Delete flow (Admin)', () => {
  it('DELETE /users/:id should delete a user', () => request(app)
    .delete(`/users/${userId}`)
    .set('Authorization', `Bearer ${adminToken}`)
    .expect(204));

  it('DELETE /users/:id that does not exist should return 404', () => request(app)
    .delete(`/users/${userId}`)
    .set('Authorization', `Bearer ${adminToken}`)
    .expect(404));

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

  it('GET /users/:id should return 404', () => request(app)
    .get(`/users/${userId}`)
    .set('Authorization', `Bearer ${adminToken}`)
    .expect(404));
});
