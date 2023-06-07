import express from 'express';
import cors from 'cors';

import errorHandler from './errorHandler.js';
import GenericRouter from './routes/genericCRUD.js';
import GenericController from './controllers/genericCRUD.js';
import userService from './services/user.js';
import cardService from './services/card.js';

import userRouter from './routes/user.js';
import cardRouter from './routes/card.js';
import securityRouter from './routes/security.js';

import { connection } from './db/index.js';
import { populateUser } from './middleware.js';

const app = express();

process.env.PWD = process.cwd();
let origin = 'http://localhost:8080';
if (process.env.NODE_ENV === 'production') {
  // TODO: Change this to your frontend URL ENV VAR
  origin = 'https://challenge-2023.mrpink.dev';
}

app.use(cors({
  origin,
}));

app.use(express.json());
app.use(populateUser);

app.use(securityRouter(userService));
app.use(securityRouter(cardService));
app.use('/users', userRouter);

app.use('/cards', cardRouter);
app.use('/users2', new GenericRouter(new GenericController(userService)));

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
