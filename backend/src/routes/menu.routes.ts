import { Router } from 'express';
import prisma from '../config/database';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { AppError } from '../middleware/errorHandler';

const router = Router();

router.get('/:restaurantId', async (req, res, next) => {
  try {
    const menus = await prisma.menu.findMany({
      where: { restaurantId: req.params.restaurantId, isActive: true },
      include: { items: { where: { isAvailable: true } } },
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, data: menus });
  } catch (err) { next(err); }
});

router.post('/', authenticate, authorize('RESTAURANT_OWNER'), async (req, res, next) => {
  try {
    const restaurant = await prisma.restaurant.findUnique({ where: { id: req.body.restaurantId } });
    if (!restaurant || restaurant.ownerId !== req.user!.userId) throw new AppError('Forbidden', 403);
    const menu = await prisma.menu.create({ data: req.body });
    res.status(201).json({ success: true, data: menu });
  } catch (err) { next(err); }
});

router.put('/:id', authenticate, authorize('RESTAURANT_OWNER'), async (req, res, next) => {
  try {
    const menu = await prisma.menu.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, data: menu });
  } catch (err) { next(err); }
});

router.delete('/:id', authenticate, authorize('RESTAURANT_OWNER'), async (req, res, next) => {
  try {
    await prisma.menu.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Menu deleted' });
  } catch (err) { next(err); }
});

export default router;
