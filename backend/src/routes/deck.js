import { Router } from 'express';

import deckController from '../controllers/deck.js';
import { isLogged } from '../middleware.js';

const router = Router();

router.get('/', isLogged, deckController.cget);
router.get('/:id', isLogged, deckController.get);
router.post('/', isLogged, deckController.post);
router.patch('/:id', isLogged, deckController.patch);
router.delete('/:id', isLogged, deckController.delete);
router.post('/:id/cards', isLogged, deckController.addCard);

export default router;
