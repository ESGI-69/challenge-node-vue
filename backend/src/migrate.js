import { connection } from './db/index.js';

connection.sync({ force: true }).then(() => {
  console.log('Database synchronized');
  connection.close();
});
