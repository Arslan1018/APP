import { Request, Response, NextFunction } from 'express';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// POST /api/qr/generate/:itemId — generate QR code for a menu item
export const generateQR = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { itemId } = req.params;

    const item = await prisma.menuItem.findUnique({
      where: { id: itemId },
      include: { menu: { include: { restaurant: { select: { ownerId: true } } } } },
    });
    if (!item) throw new AppError('Item not found', 404);
    if (item.menu.restaurant.ownerId !== req.user!.userId) {
      throw new AppError('Forbidden', 403);
    }

    // Deactivate any old QR codes for this item
    await prisma.qRCode.updateMany({
      where: { itemId, isActive: true },
      data: { isActive: false },
    });

    // Create new QR record
    const code = uuidv4();
    const arUrl = `${FRONTEND_URL}/ar/${code}`;

    // Generate QR image as base64 data URL
    const qrDataUrl = await QRCode.toDataURL(arUrl, {
      width: 400,
      margin: 2,
      color: { dark: '#1a1a1a', light: '#ffffff' },
      errorCorrectionLevel: 'H',
    });

    const qrRecord = await prisma.qRCode.create({
      data: {
        itemId,
        code,
        qrImageUrl: qrDataUrl, // In production, upload to S3 and store URL
        isActive: true,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        id: qrRecord.id,
        code,
        arUrl,
        qrImageUrl: qrDataUrl,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/qr/:code — resolve QR code to menu item + AR data (public)
export const resolveQR = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.params;

    const qrCode = await prisma.qRCode.findUnique({
      where: { code },
      include: {
        item: {
          include: {
            arModel: true,
            menu: {
              include: {
                restaurant: {
                  select: {
                    id: true,
                    name: true,
                    logoUrl: true,
                    currency: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!qrCode || !qrCode.isActive) {
      throw new AppError('QR code not found or inactive', 404);
    }

    // Track the scan (fire and forget)
    trackScan(qrCode.id, qrCode.item.menu.restaurant.id, req).catch(() => {});

    res.json({ success: true, data: qrCode.item });
  } catch (err) {
    next(err);
  }
};

// POST /api/qr/:code/scan — explicit scan tracking
export const trackScanEndpoint = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const qrCode = await prisma.qRCode.findUnique({ where: { code: req.params.code } });
    if (!qrCode) throw new AppError('QR code not found', 404);

    const item = await prisma.menuItem.findUnique({
      where: { id: qrCode.itemId },
      include: { menu: { select: { restaurantId: true } } },
    });

    await trackScan(qrCode.id, item!.menu.restaurantId, req);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// GET /api/qr/restaurant/:restaurantId — list all QR codes for a restaurant
export const getRestaurantQRCodes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: req.params.restaurantId },
    });
    if (!restaurant || restaurant.ownerId !== req.user!.userId) {
      throw new AppError('Forbidden', 403);
    }

    const qrCodes = await prisma.qRCode.findMany({
      where: {
        isActive: true,
        item: { menu: { restaurantId: req.params.restaurantId } },
      },
      include: {
        item: { select: { id: true, name: true, imageUrl: true } },
        _count: { select: { scans: true } },
      },
    });

    res.json({ success: true, data: qrCodes });
  } catch (err) {
    next(err);
  }
};

// ─── Internal Helper ──────────────────────────────────────────────────────
async function trackScan(qrCodeId: string, restaurantId: string, req: Request) {
  const userAgent = req.headers['user-agent'] || '';
  const deviceType = /mobile/i.test(userAgent) ? 'mobile' : 'desktop';

  await prisma.qRScan.create({
    data: {
      qrCodeId,
      restaurantId,
      deviceType,
      ip: req.ip || req.connection?.remoteAddress || '',
      userAgent,
    },
  });
}
