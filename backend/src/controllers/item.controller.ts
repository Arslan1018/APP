import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ItemCategory } from '@prisma/client';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

const itemSchema = z.object({
  menuId: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  price: z.number().positive(),
  category: z.nativeEnum(ItemCategory).optional(),
  imageUrl: z.string().url().optional(),
  isAvailable: z.boolean().optional(),
  isPopular: z.boolean().optional(),
  calories: z.number().int().positive().optional(),
  allergens: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

const arModelSchema = z.object({
  glbUrl: z.string().url(),
  usdzUrl: z.string().url().optional(),
  scale: z.number().positive().optional(),
  positionX: z.number().optional(),
  positionY: z.number().optional(),
  positionZ: z.number().optional(),
  rotationY: z.number().optional(),
  animated: z.boolean().optional(),
});

// GET /api/items/:menuId — list items for a menu
export const getItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await prisma.menuItem.findMany({
      where: { menuId: req.params.menuId },
      include: {
        arModel: true,
        qrCodes: { where: { isActive: true }, take: 1 },
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

// GET /api/items/:id/ar — public AR endpoint (no auth needed)
export const getItemAR = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await prisma.menuItem.findUnique({
      where: { id: req.params.id },
      include: {
        arModel: true,
        menu: {
          include: {
            restaurant: {
              select: { name: true, logoUrl: true, currency: true },
            },
          },
        },
      },
    });
    if (!item) throw new AppError('Item not found', 404);
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

// POST /api/items — create item
export const createItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = itemSchema.parse(req.body);

    // Verify the menu belongs to the requesting restaurant
    const menu = await prisma.menu.findUnique({
      where: { id: data.menuId },
      include: { restaurant: { select: { ownerId: true } } },
    });
    if (!menu) throw new AppError('Menu not found', 404);
    if (menu.restaurant.ownerId !== req.user!.userId) {
      throw new AppError('Forbidden', 403);
    }

    const item = await prisma.menuItem.create({ data });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

// PUT /api/items/:id — update item
export const updateItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = itemSchema.partial().parse(req.body);

    const existing = await prisma.menuItem.findUnique({
      where: { id: req.params.id },
      include: { menu: { include: { restaurant: { select: { ownerId: true } } } } },
    });
    if (!existing) throw new AppError('Item not found', 404);
    if (existing.menu.restaurant.ownerId !== req.user!.userId) {
      throw new AppError('Forbidden', 403);
    }

    const item = await prisma.menuItem.update({
      where: { id: req.params.id },
      data,
    });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/items/:id
export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.menuItem.findUnique({
      where: { id: req.params.id },
      include: { menu: { include: { restaurant: { select: { ownerId: true } } } } },
    });
    if (!existing) throw new AppError('Item not found', 404);
    if (existing.menu.restaurant.ownerId !== req.user!.userId) {
      throw new AppError('Forbidden', 403);
    }

    await prisma.menuItem.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Item deleted' });
  } catch (err) {
    next(err);
  }
};

// POST /api/items/:id/ar-model — attach or update AR model
export const upsertARModel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = arModelSchema.parse(req.body);

    const item = await prisma.menuItem.findUnique({
      where: { id: req.params.id },
      include: { menu: { include: { restaurant: { select: { ownerId: true } } } } },
    });
    if (!item) throw new AppError('Item not found', 404);
    if (item.menu.restaurant.ownerId !== req.user!.userId) {
      throw new AppError('Forbidden', 403);
    }

    const arModel = await prisma.aRModel.upsert({
      where: { itemId: req.params.id },
      update: data,
      create: { itemId: req.params.id, ...data },
    });

    res.json({ success: true, data: arModel });
  } catch (err) {
    next(err);
  }
};
