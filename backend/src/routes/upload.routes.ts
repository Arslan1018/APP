import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
const router = Router();
router.post('/model', authenticate, async (_req, res) => {
  res.json({ success: true, message: 'Upload endpoint - configure AWS S3 keys' });
});
export default router;
