import { Router } from 'express';
import userControler from '../controllers/user.js';
import { isLogged } from '../middleware.js';
const router = Router();

router.get('/', isLogged, userControler.getCards);
// router.post('/:cardId', isAdmin, userControler.addCard);

export default router;
