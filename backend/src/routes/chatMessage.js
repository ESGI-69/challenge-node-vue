import { Router } from 'express';

import { isAdmin, isLogged } from '../middleware.js';

import chatMessageController from '../controllers/chatMessage.js';

const router = Router();

router.get('/', isLogged, chatMessageController.cget);
router.post('/', isLogged, chatMessageController.post);
router.delete('/:id', isAdmin, chatMessageController.delete);
router.get('/report', isAdmin, chatMessageController.getReported);
router.patch('/report/:id', isLogged, chatMessageController.patchReport);
router.patch('/unreport/:id', isAdmin, chatMessageController.patchUnreport);

export default router;
