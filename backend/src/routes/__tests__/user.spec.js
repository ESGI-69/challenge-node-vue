import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import { app } from '../../index.js';


describe('Users route', () => {
  it('should return 0 users', (done) => {
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
});
