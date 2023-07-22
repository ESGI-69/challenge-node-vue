import { Router } from 'express';

import gameController from '../controllers/game.js';
import { isLogged } from '../middleware.js';
// import io from '../index.js';

const router = Router();

router.get('/history', isLogged, gameController.getHistory);
router.get('/:id', isLogged, gameController.get);
router.post('/', isLogged, gameController.post);
router.post('/leave', isLogged, gameController.leave);
router.post('/join', isLogged, gameController.join);
router.post('/start', isLogged, gameController.start);
router.post('/end-turn', isLogged, gameController.endTurn);
router.delete('/', isLogged, gameController.delete);

export default router;
