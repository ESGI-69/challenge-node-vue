import { Router } from 'express';
import packController from '../controllers/pack.js';
import { hasPackBalance, isLogged } from '../middleware.js';
const router = Router();

router.get('/', isLogged, packController.findAll);
router.post('/buy', isLogged, hasPackBalance, packController.buy);
router.post('/:id/open', isLogged, packController.open);
// router.post('/give', isAdmin, packController.give);

export default router;
