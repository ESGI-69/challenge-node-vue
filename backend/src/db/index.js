import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import syncMongo from './syncMongo.js';

import card from './models/Card.js';
import pack from './models/Pack.js';
import pack_Card from './models/PackCard.js';
import user from './models/User.js';
import user_Card from './models/UserCard.js';
import game from './models/Game.js';

/**
 * The domain name of the postgres database
 * @type {'127.0.0.1' | 'postgres'}
 */
let postgresDomainName  = '127.0.0.1';
/**
 * The domain name of the mongodb database
 * @type {'127.0.0.1' | 'mongo'}
 */
let mongoDomainName = '127.0.0.1';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: './../.env' });
} else {
  postgresDomainName = 'postgres';
  mongoDomainName = 'mongo';
}

/**
 * Sequelize connection
 * @type {import('sequelize').Sequelize}
 */
const connection = new Sequelize(`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${postgresDomainName}:5432/${process.env.POSTGRES_DB}`, {
  logging: false,
});

await mongoose.connect(`mongodb://${process.env.MONGO_ROOT_USER}:${process.env.MONGO_ROOT_PASSWORD}@${mongoDomainName}:27017/${process.env.MONGO_DB}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: 'admin',
});

// Load models
const Card = card(connection);
const Pack = pack(connection);
const Pack_Card = pack_Card(connection);
const User = user(connection);
const User_Card = user_Card(connection);
const Game = game(connection);

// Launch associations methods for relations between tables
User.associate();
Card.associate();
Pack.associate();
Game.associate();

// Syncronize MongoDB with MySQL database, create documents in MongoDB for each row in MySQL. Do not pass junction tables to syncMongo
await syncMongo(
  [
    Card,
    Pack,
    User,
    Game,
  ],
  connection,
);

export {
  Card,
  connection,
  Pack,
  Pack_Card,
  User_Card,
  User,
  Game,
};

