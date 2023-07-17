import { Router } from 'express';

import gameController from '../controllers/game.js';
import { isLogged } from '../middleware.js';
// import io from '../index.js';

const router = Router();

router.get('/:id', isLogged, gameController.get);
router.post('/', isLogged, gameController.post);
router.post('/leave', isLogged, gameController.leave);
router.post('/join', isLogged, gameController.join);
router.post('/start', isLogged, gameController.start);
router.delete('/', isLogged, gameController.delete);

export default router;
