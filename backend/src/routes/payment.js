import { Router } from 'express';
import multer from 'multer';

import paymentController from '../controllers/payment.js';
import { isLogged } from '../middleware.js';

const router = Router();

const upload = multer();

router.get('/', isLogged, paymentController.cget);
router.post('/', isLogged, upload.none(), paymentController.post);
router.patch('/:id', isLogged, paymentController.patch);

export default router;
