import { Router } from 'express';
import paymentController from '../controllers/payment.js';
import { isLogged } from '../middleware.js';

const router = Router();

router.post('/', isLogged, paymentController.post);

export default router;
