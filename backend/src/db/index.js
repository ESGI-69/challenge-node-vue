import Sequelize from 'sequelize';
import user from './models/User.js';
import card from './models/Card.js';
import user_Cards from './models/UserCard.js';
import dotenv from 'dotenv';

/**
 * The domain name of the postgres database
 * @type {'localhost' | 'postgres'}
 */
let postgresDomainName  = 'localhost';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: './../.env'});
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

const User = user(connection);
const Card = card(connection);
const User_Cards = user_Cards(connection);

// Launch associations methods for relations between tables
User.associate();
Card.associate();

export {
  connection,
  User,
  Card,
  User_Cards,
};

