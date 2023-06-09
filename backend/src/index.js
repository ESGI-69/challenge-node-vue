import express from 'express';
import cors from 'cors';

import errorHandler from './errorHandler.js';
import userService from './services/user.js';

import cardRouter from './routes/card.js';
import collectionRouter from './routes/collection.js';
import packRouter from './routes/pack.js';
import securityRouter from './routes/security.js';
import userRouter from './routes/user.js';

import { connection } from './db/index.js';
import { populateUser } from './middleware.js';

const app = express();

process.env.PWD = process.cwd();

app.use(cors({
  origin: process.env.FRONTEND_URL,
}));

app.use(express.json());
app.use(populateUser);

app.use(securityRouter(userService));
app.use('/users', userRouter);

app.use('/cards', cardRouter);

app.use('/collection', collectionRouter);

app.use('/packs', packRouter);

app.get('/health', async (req, res) => {
  try {
    await connection.authenticate({ logging: false });
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(3000, () => console.log('Server started on port 3000'));
}

export { app };
