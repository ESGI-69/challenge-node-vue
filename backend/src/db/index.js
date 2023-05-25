import Sequelize from 'sequelize';
import user from './models/user.js';

// change connection string to use the PG_DATABASE_URL environment variable
const connection = new Sequelize('postgres://root:password@localhost:5432/app', {});

const User = user(connection);

export {
  connection,
  User,
};

