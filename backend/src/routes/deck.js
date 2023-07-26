import { Router } from 'express';

import deckController from '../controllers/deck.js';
import { isAdmin, isLogged } from '../middleware.js';

const router = Router();

router.get('/', isAdmin, deckController.cget);
router.post('/', isLogged, deckController.post);
router.get('/my-decks', isLogged, deckController.getMyDecks);
router.get('/search-my-decks', isLogged, deckController.getSearchMyDecks);
router.get('/valid-decks', isLogged, deckController.getValidDecks);
router.get('/:id', isLogged, deckController.get);
router.patch('/:id', isLogged, deckController.patch);
router.delete('/:id', isLogged, deckController.delete);
router.post('/:id/cards', isLogged, deckController.addCard);
router.post('/:id/cards', isLogged, deckController.addCard);
router.delete('/:id/cards/', isLogged, deckController.removeCard);
router.get('/:id/is-valid', isLogged, deckController.isValid);

export default router;
