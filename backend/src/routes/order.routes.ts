import { Router } from 'express';
import * as orders from '../controllers/order.controller';
import { authenticate, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/', optionalAuth, orders.createOrder);
router.get('/:id', authenticate, orders.getOrder);
router.get('/restaurant/:restaurantId', authenticate, orders.getRestaurantOrders);
router.put('/:id/status', authenticate, orders.updateOrderStatus);

export default router;
