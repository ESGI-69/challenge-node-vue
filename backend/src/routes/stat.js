import { Router } from 'express';

import statController from '../controllers/stat.js';
import { isAdmin, isLogged } from '../middleware.js';

const router = Router();

router.get('/cards-count', isLogged, statController.getCardsCount);
router.get('/cards-count-by-type', isLogged, statController.getCardsCountByType);
router.get('/total-xp', isLogged, statController.getTotalXp);
router.get('/total-pack-open', isLogged, statController.getTotalPackOpen);
router.get('/number-of-pack-open-by-day', isLogged, statController.getNumberOfPackOpenByDay);
//admin routes
router.get('/admin/total-games', isAdmin, statController.getTotalNumbersOfCurrentGames);
router.get('/admin/total-credits-purchased', isAdmin, statController.getTotalCreditsPurchased);
router.get('/admin/total-money-spent', isAdmin, statController.getTotalMoneySpent);
router.get('/admin/average-game-duration', isAdmin, statController.getAverageGameDuration);
router.get('/admin/best-player', isAdmin, statController.getBestPlayer);
router.get('/admin/best-seller-product', isAdmin, statController.getBestSellerProduct);
router.get('/admin/total-users', isAdmin, statController.getTotalUsers);
export default router;
