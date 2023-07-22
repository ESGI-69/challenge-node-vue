import { Router } from 'express';

import deckController from '../controllers/deck.js';
import { isAdmin, isLogged } from '../middleware.js';

const router = Router();

router.get('/', isAdmin, deckController.cget);
router.get('/my-decks', isLogged, deckController.getMyDecks);
router.get('/:id', isLogged, deckController.get);
router.post('/', isLogged, deckController.post);
router.patch('/:id', isLogged, deckController.patch);
router.delete('/:id', isLogged, deckController.delete);
router.post('/:id/cards', isLogged, deckController.addCard);
router.post('/:id/cards', isLogged, deckController.addCard);
router.delete('/:id/cards/', isLogged, deckController.removeCard);

export default router;
