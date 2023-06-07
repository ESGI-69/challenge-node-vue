import { User } from '../src/db/index.js';

/**
 * Remove the user from the database
 * @param {number} id The user id
 */
export default (id) => {
  return User.destroy({ where: { id } });
};
