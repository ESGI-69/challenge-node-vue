import { Router } from 'express';
import multer from 'multer';

import paymentController from '../controllers/payment.js';
import { isAdmin, isLogged } from '../middleware.js';

const router = Router();

const upload = multer();

router.get('/', isLogged, paymentController.cget);
router.post('/', isLogged, upload.none(), paymentController.post);
router.patch('/:id', isLogged, paymentController.patch);
router.get('/admin', isAdmin, paymentController.cgetAdmin);
router.patch('/admin/:id', isAdmin, paymentController.updateStatus);
router.patch('/admin/credit/:id', isAdmin, paymentController.creditPlayer);

export default router;
