import { Router } from 'express';
import multer from 'multer';

import cardController from '../controllers/card.js';
import { isAdmin, isLogged } from '../middleware.js';

const cardImageStorage = multer.diskStorage({
  destination: 'public/card-images',
});

const cardImageUpload = multer({
  storage: cardImageStorage,
  limits: {
    files: 1,
    fileSize: 1024 * 1024 * 10, // 10MB
  },
});

const addCardImage = (req, res, next) => {
  if (req.file) {
    req.body.image = req.file.filename;
  }
  next();
};

const router = Router();

router.get('/', isAdmin, cardController.cget);
router.post('/', isAdmin, cardImageUpload.single('image'), addCardImage, cardController.post);
router.get('/:id', isLogged, cardController.get);
router.get('/:id/image', cardController.getImage);
router.patch('/:id', isAdmin, cardImageUpload.single('image'), addCardImage, cardController.patch);
router.delete('/:id', isAdmin, cardController.delete);

export default router;
