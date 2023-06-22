import { Router } from 'express';
import multer from 'multer';

import gameController from '../controllers/game.js';
import { isAdmin, isLogged } from '../middleware.js';

const router = Router();

router.get('/', isLogged, gameController.cget);
router.post('/', isLogged, gameController.post);
router.get('/:id', isLogged, gameController.get);
router.put('/:id', isLogged, gameController.put);
router.delete('/:id', isLogged, gameController.delete);

export default router;
