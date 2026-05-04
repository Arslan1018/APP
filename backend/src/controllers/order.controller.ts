import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { OrderStatus } from '@prisma/client';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

const createOrderSchema = z.object({
  restaurantId: z.string().uuid(),
  items: z.array(z.object({
    itemId: z.string().uuid(),
    quantity: z.number().int().positive(),
    notes: z.string().optional(),
  })).min(1),
  customerName: z.string().min(1).max(100).optional(),
  customerPhone: z.string().optional(),
  customerEmail: z.string().email().optional(),
  tableNumber: z.string().optional(),
  notes: z.string().max(500).optional(),
});

// POST /api/orders — create new order
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createOrderSchema.parse(req.body);

    // Fetch all items and validate they belong to the restaurant
    const itemIds = data.items.map((i) => i.itemId);
    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: { in: itemIds },
        isAvailable: true,
        menu: { restaurantId: data.restaurantId },
      },
    });

    if (menuItems.length !== itemIds.length) {
      throw new AppError('One or more items are unavailable or not found', 400);
    }

    // Calculate totals
    const itemMap = new Map(menuItems.map((i) => [i.id, i]));
    let subtotal = 0;
    const orderItems = data.items.map((orderItem) => {
      const menuItem = itemMap.get(orderItem.itemId)!;
      const totalPrice = menuItem.price * orderItem.quantity;
      subtotal += totalPrice;
      return {
        itemId: orderItem.itemId,
        quantity: orderItem.quantity,
        unitPrice: menuItem.price,
        totalPrice,
        notes: orderItem.notes,
      };
    });

    const TAX_RATE = 0.05; // 5%
    const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
    const total = parseFloat((subtotal + tax).toFixed(2));

    // Generate order number
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        restaurantId: data.restaurantId,
        customerId: req.user?.userId,
        orderNumber,
        subtotal,
        tax,
        total,
        tableNumber: data.tableNumber,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        notes: data.notes,
        items: { create: orderItems },
      },
      include: {
        items: { include: { item: { select: { name: true, imageUrl: true } } } },
        restaurant: { select: { name: true, currency: true } },
      },
    });

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/:id
export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: { include: { item: { select: { name: true, imageUrl: true } } } },
        restaurant: { select: { name: true, currency: true } },
      },
    });
    if (!order) throw new AppError('Order not found', 404);

    // Only owner or the customer can view
    if (
      req.user?.userId !== order.customerId &&
      req.user?.restaurantId !== order.restaurantId
    ) {
      throw new AppError('Forbidden', 403);
    }

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/restaurant/:restaurantId
export const getRestaurantOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { restaurantId } = req.params;
    const { status, page = '1', limit = '20' } = req.query;

    const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
    if (!restaurant || restaurant.ownerId !== req.user!.userId) {
      throw new AppError('Forbidden', 403);
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: {
          restaurantId,
          ...(status ? { status: status as OrderStatus } : {}),
        },
        include: {
          items: { include: { item: { select: { name: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit as string),
      }),
      prisma.order.count({ where: { restaurantId } }),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/orders/:id/status
export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = z.object({ status: z.nativeEnum(OrderStatus) }).parse(req.body);

    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) throw new AppError('Order not found', 404);

    // Only restaurant owner can update status
    if (req.user?.restaurantId !== order.restaurantId) {
      throw new AppError('Forbidden', 403);
    }

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};
