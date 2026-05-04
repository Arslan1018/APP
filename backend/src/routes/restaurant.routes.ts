import { Router } from 'express';
import prisma from '../config/database';
import { authenticate } from '../middleware/auth.middleware';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// GET /api/restaurants/:id — public profile
router.get('/:id', async (req, res, next) => {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: req.params.id },
      select: {
        id: true, name: true, slug: true, description: true,
        address: true, city: true, country: true,
        phone: true, logoUrl: true, coverUrl: true, currency: true,
        menus: {
          where: { isActive: true },
          include: {
            items: {
              where: { isAvailable: true },
              include: { arModel: true, qrCodes: { where: { isActive: true }, take: 1 } },
            },
          },
        },
      },
    });
    if (!restaurant) throw new AppError('Restaurant not found', 404);
    res.json({ success: true, data: restaurant });
  } catch (err) { next(err); }
});

// PUT /api/restaurants/:id — update (owner only)
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const restaurant = await prisma.restaurant.findUnique({ where: { id: req.params.id } });
    if (!restaurant) throw new AppError('Restaurant not found', 404);
    if (restaurant.ownerId !== req.user!.userId) throw new AppError('Forbidden', 403);

    const updated = await prisma.restaurant.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
});

export default router;
