import { Router } from 'express';

import gameController from '../controllers/game.js';
import { isLogged } from '../middleware.js';
// import io from '../index.js';

const router = Router();

router.post('/', isLogged, gameController.post);
router.get('/:id', isLogged, gameController.get);
// router.delete('/:id', isLogged, gameController.delete);

// router.delete('/leave/:id', isLogged, gameController.leaveGame);
// en post parce que y'a un payload (roomId)
router.post('/leave/:id', isLogged, gameController.leaveGame);

export default router;
