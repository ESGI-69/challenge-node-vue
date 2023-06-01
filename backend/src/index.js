import express from 'express';
import errorHandler from './errorHandler.js';
import GenericRouter from './routes/genericCRUD.js';
import GenericController from './controllers/genericCRUD.js';
import userService from './services/user.js';

import userRouter from './routes/user.js';
import securityRouter from './routes/security.js';

import { connection } from './db/index.js';

const app = express();

app.use(express.json());

app.use(securityRouter(userService));
app.use('/users', userRouter);

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
