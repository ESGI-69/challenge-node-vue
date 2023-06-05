import { Router } from 'express';
import cardController from '../controllers/card.js';
import { isLogged, isAdmin } from '../middleware.js';
const router = Router();

router.get('/', isLogged, cardController.cget);
router.post('/', isAdmin, cardController.post);
router.get('/:id', isLogged, cardController.get);
router.put('/:id', isAdmin, cardController.put);
router.patch('/:id', isAdmin, cardController.patch);
router.delete('/:id', isAdmin, cardController.delete);

export default router;
