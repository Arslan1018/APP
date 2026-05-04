import { Router } from 'express';
import { getAnalytics } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
router.get('/:restaurantId', authenticate, getAnalytics);
export default router;
