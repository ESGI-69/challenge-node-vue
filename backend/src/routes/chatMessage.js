import { Router } from 'express';

import { isAdmin, isLogged } from '../middleware.js';

import chatMessageController from '../controllers/chatMessage.js';

const router = Router();

router.get('/', isLogged, chatMessageController.cget);
router.post('/', isLogged, chatMessageController.post);
router.delete('/:id', isAdmin, chatMessageController.delete);

export default router;
