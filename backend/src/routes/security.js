import { Router } from 'express';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: './../.env'});
}

/**
 * @param {typeof import('../services/user.js').default} userService
 */
export default (userService) => {
  const router = Router();

  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const [user] = await userService.findAll({ email });
    if (!user) {
      return res.sendStatus(401);
    }
    if (!await user.checkPassword(password)) {
      return res.sendStatus(401);
    }
    
    const token = user.generateToken();
    res.status(200).json({ token });
  });

  return router;
};
