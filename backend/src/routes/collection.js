import { Router } from 'express';
import userControler from '../controllers/user.js';
import { isLogged } from '../middleware.js';
const router = Router();

router.get('/', isLogged, userControler.getCards);
router.get('/all-ids', isLogged, userControler.getAllCardIds);
// router.get('/:id', isLogged, userControler.getCard);

export default router;
