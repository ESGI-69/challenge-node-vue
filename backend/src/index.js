import express from 'express';
import GenericRouter from './routes/genericCRUD.js';
import GenericController from './controllers/genericCRUD.js';
import userService from './services/user.js';

import userRouter from './routes/user.js';
import securityRouter from './routes/security.js';

const app = express();

app.use(express.json());

app.use(securityRouter(userService));
app.use('/users', userRouter);
app.use('/users2', new GenericRouter(new GenericController(userService)));

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.post('/', (req, res) => {
  res.json(req.body);
});

app.listen(3000, () => console.log('Server started on port 3000'));
