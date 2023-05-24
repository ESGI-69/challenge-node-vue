import { Router } from 'express';

export default function (Controller) {
  const router = Router();

  router.get('/', Controller.cget);
  router.post('/', Controller.post);
  router.get('/:id', Controller.get);
  router.put('/:id', Controller.put);
  router.patch('/:id', Controller.patch);
  router.delete('/:id', Controller.delete);
  return router;
}
