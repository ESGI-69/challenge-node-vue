import { Router } from 'express';
import jwt from 'jsonwebtoken';

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
    // Use env variable for JWT secret
    const token = jwt.sign({ id: user.id }, 'JWT_SECRET', {
      expiresIn: '1y',
      algorithm: 'HS256',
    });
    res.status(200).json({ token });
  });

  return router;
};
