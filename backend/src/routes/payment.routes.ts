import { Router } from 'express';
const router = Router();
// Payment routes - Stripe integration placeholder
router.post('/intent', async (_req, res) => {
  res.json({ success: true, message: 'Payment intent endpoint - configure Stripe keys' });
});
router.post('/webhook', async (_req, res) => {
  res.json({ received: true });
});
export default router;
