import { Router } from 'express';
import cardController from '../controllers/card.js';
const router = Router();

router.get('/', cardController.cget);
router.post('/', cardController.post);
router.get('/:id', cardController.get);
router.put('/:id', cardController.put);
router.patch('/:id', cardController.patch);
router.delete('/:id', cardController.delete);

export default router;
