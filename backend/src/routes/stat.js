import { Router } from 'express';

import statController from '../controllers/stat.js';
import { isLogged } from '../middleware.js';

const router = Router();

router.get('/cards-count', isLogged, statController.getCardsCount);

export default router;
