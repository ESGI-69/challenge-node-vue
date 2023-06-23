import { Router } from 'express';
import multer from 'multer';

import userController from '../controllers/user.js';
import { isAdmin, isLogged } from '../middleware.js';

const profilePictureStorage = multer.diskStorage({
  destination: 'public/profile-pictures',
});

const profilePictureUpload = multer({
  storage: profilePictureStorage,
  limits: {
    files: 1,
    fileSize: 1024 * 1024 * 5, // 5MB
  },
});
const router = Router();

/**
 * Express.js middleware for adding the profile picture to the request body
 * @param {import('express').Request} req Express request
 * @param {import('express').Response} res Express response
 * @param {import('express').NextFunction} next Express next function
 */
const addProfilePicture = (req, res, next) => {
  if (req.file) {
    req.body.avatar = req.file.filename;
  } else {
    req.body.avatar = 'default.png';
  }
  next();
};

router.get('/', isAdmin, userController.cget);
router.post('/', profilePictureUpload.single('avatar'), addProfilePicture, userController.post);
router.get('/me', isLogged, userController.me);
router.get('/me/avatar', isLogged, userController.meAvatar);
router.get('/:id', isAdmin, userController.get);
router.get('/:id/avatar', isLogged, userController.getAvatar);
router.put('/:id', isAdmin, userController.put);
router.patch('/:id', isAdmin, userController.patch);
router.delete('/:id', isAdmin, userController.delete);
router.post('/confirm', userController.confirm);
router.get('/token/:id', isAdmin, userController.getToken);

export default router;
