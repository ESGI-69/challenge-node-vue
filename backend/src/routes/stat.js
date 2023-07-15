import { Router } from 'express';

import statController from '../controllers/stat.js';
import { isLogged } from '../middleware.js';

const router = Router();

router.get('/cards-count', isLogged, statController.getCardsCount);
router.get('/cards-count-by-type', isLogged, statController.getCardsCountByType);
router.get('/total-xp', isLogged, statController.getTotalXp);
router.get('/total-pack-open', isLogged, statController.getTotalPackOpen);
router.get('/number-of-pack-open-by-day', isLogged, statController.getNumberOfPackOpenByDay);
export default router;
