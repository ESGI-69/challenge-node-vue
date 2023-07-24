import { Router } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: './../.env' });
}

/**
 * @param {typeof import('../services/user.js').default} userService
 */
export default (userService) => {
  const router = Router();

  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await userService.findLogin({ email });
    if (!user) {
      return res.status(401).send({
        code: 'invalid_credentials',
        message: 'Invalid credentials',
      });
    }
    if (!await user.checkPassword(password)) {
      return res.status(401).send({
        code: 'invalid_credentials',
        message: 'Invalid credentials',
      });
    }

    if (!await user.isEmailConfirmed()) {
      return res.status(401).send({
        code: 'email_not_validated',
        message: 'Email not validated',
      });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1y',
      algorithm: 'HS256',
    });
    res.status(200).json({ token });
  });

  return router;
};
