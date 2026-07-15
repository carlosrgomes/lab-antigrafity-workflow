import { Router } from 'express';
import { GameController, OrderController } from './controllers.js';

const router = Router();
const gameController = new GameController();
const orderController = new OrderController();

router.get('/games', (req, res, next) => gameController.getAll(req, res, next));
router.get('/games/:id', (req, res, next) =>
  gameController.getById(req, res, next),
);
router.post('/games', (req, res, next) =>
  gameController.create(req, res, next),
);
router.delete('/games/:id', (req, res, next) =>
  gameController.delete(req, res, next),
);
router.post('/orders', (req, res, next) =>
  orderController.create(req, res, next),
);

export default router;
