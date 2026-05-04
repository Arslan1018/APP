import { Router } from 'express';
import * as qr from '../controllers/qr.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/:code', qr.resolveQR); // public
router.post('/:code/scan', qr.trackScanEndpoint); // public
router.post('/generate/:itemId', authenticate, authorize('RESTAURANT_OWNER'), qr.generateQR);
router.get('/restaurant/:restaurantId', authenticate, qr.getRestaurantQRCodes);

export default router;
