import { connection } from './db/index.js';

connection.sync({ force: true }).then(() => {
  // eslint-disable-next-line no-console
  console.log('Database synchronized');
  connection.close();
});
