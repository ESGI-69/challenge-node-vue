import Sequelize from 'sequelize';
import dotenv from 'dotenv';

import card from './models/Card.js';
import pack from './models/Pack.js';
import pack_Card from './models/PackCard.js';
import user from './models/User.js';
import user_Card from './models/UserCard.js';

/**
 * The domain name of the postgres database
 * @type {'localhost' | 'postgres'}
 */
let postgresDomainName  = 'localhost';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: './../.env' });
} else {
  postgresDomainName = 'postgres';
}

/**
 * Sequelize connection
 * @type {import('sequelize').Sequelize}
 */
const connection = new Sequelize(`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${postgresDomainName}:5432/${process.env.POSTGRES_DB}`, {
  logging: false,
});

// Load models
const Card = card(connection);
const Pack = pack(connection);
const Pack_Card = pack_Card(connection);
const User = user(connection);
const User_Card = user_Card(connection);

// Launch associations methods for relations between tables
User.associate();
Card.associate();
Pack.associate();

export {
  Card,
  connection,
  Pack,
  Pack_Card,
  User_Card,
  User,
};

