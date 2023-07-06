import { connection } from './db/index.js';

await connection.sync({ force: true });
// eslint-disable-next-line no-console
console.log('Database synchronized');
await connection.close();
process.exit(0);
