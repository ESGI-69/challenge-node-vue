import { Router } from 'express';
import userController from '../controllers/user.js';
import { isLogged, isAdmin } from '../middleware.js';
const router = Router();

router.get('/', isAdmin, userController.cget);
router.post('/', userController.post);
router.get('/me', isLogged, userController.me);
router.get('/:id', isAdmin, userController.get);
router.put('/:id', isAdmin, userController.put);
router.patch('/:id', isAdmin, userController.patch);
router.delete('/:id', isAdmin, userController.delete);

export default router;
