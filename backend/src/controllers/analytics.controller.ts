import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

// GET /api/analytics/:restaurantId — dashboard analytics
export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
    if (!restaurant || restaurant.ownerId !== req.user!.userId) {
      throw new AppError('Forbidden', 403);
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalScans,
      scansLast30Days,
      scansLast7Days,
      totalOrders,
      ordersLast30Days,
      revenueResult,
      topItems,
      deviceBreakdown,
    ] = await Promise.all([
      prisma.qRScan.count({ where: { restaurantId } }),
      prisma.qRScan.count({ where: { restaurantId, scannedAt: { gte: thirtyDaysAgo } } }),
      prisma.qRScan.count({ where: { restaurantId, scannedAt: { gte: sevenDaysAgo } } }),
      prisma.order.count({ where: { restaurantId } }),
      prisma.order.count({ where: { restaurantId, createdAt: { gte: thirtyDaysAgo } } }),
      prisma.order.aggregate({
        where: { restaurantId, paymentStatus: 'PAID' },
        _sum: { total: true },
      }),
      // Top 5 items by scan count
      prisma.qRScan.groupBy({
        by: ['qrCodeId'],
        where: { restaurantId },
        _count: { qrCodeId: true },
        orderBy: { _count: { qrCodeId: 'desc' } },
        take: 5,
      }),
      // Device breakdown
      prisma.qRScan.groupBy({
        by: ['deviceType'],
        where: { restaurantId },
        _count: { deviceType: true },
      }),
    ]);

    // Daily scans for the last 30 days
    const dailyScans = await prisma.$queryRaw<Array<{ date: string; count: bigint }>>`
      SELECT DATE(scanned_at)::text as date, COUNT(*) as count
      FROM qr_scans
      WHERE restaurant_id = ${restaurantId}
        AND scanned_at >= ${thirtyDaysAgo}
      GROUP BY DATE(scanned_at)
      ORDER BY date ASC
    `;

    res.json({
      success: true,
      data: {
        overview: {
          totalScans,
          scansLast30Days,
          scansLast7Days,
          totalOrders,
          ordersLast30Days,
          totalRevenue: revenueResult._sum.total || 0,
        },
        topItems,
        deviceBreakdown,
        dailyScans: dailyScans.map((d) => ({ date: d.date, count: Number(d.count) })),
      },
    });
  } catch (err) {
    next(err);
  }
};
