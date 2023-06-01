import request from 'supertest';

import { app } from './../src/index.js';

/**
 * Get JWT token for a user
 * @param {string} [email="johndoe@example.com"] - Email of the user log with
 * @param {string} [password="123456"] - Password of the user log with
 * @returns {Promise<string>} JWT token
 */
export default async (email = 'johndoe@example.com', password = '123456') => {
  const res = await request(app).post('/login').send({ email, password });
  return res.body.token;
};
