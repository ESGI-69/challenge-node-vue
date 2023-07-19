import { Router } from 'express';
import productController from '../controllers/product.js';
import { isAdmin, isLogged } from '../middleware.js';

const router = Router();

router.get('/', isLogged, productController.cget);
router.post('/', isAdmin, productController.post);
router.get('/:id', isLogged, productController.get);
router.patch('/:id', isAdmin, productController.patch);
router.delete('/:id', isAdmin, productController.delete);

export default router;
