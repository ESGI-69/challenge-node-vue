import { Router } from 'express';
import userController from '../controllers/user.js';
const router = Router();

router.get('/', userController.cget);
router.post('/', userController.post);
router.get('/:id', userController.get);
router.put('/:id', userController.put);
router.patch('/:id', userController.patch);
router.delete('/:id', userController.delete);

export default router;
