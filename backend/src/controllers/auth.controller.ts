import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '../config/database';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../config/jwt';
import { AppError } from '../middleware/errorHandler';

// ─── Validation Schemas ─────────────────────────────────────────────────────
const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'Password must contain letters and numbers'),
  restaurantName: z.string().min(2).max(100).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// ─── Register ─────────────────────────────────────────────────────────────
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = registerSchema.parse(req.body);

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new AppError('Email already registered', 409);

    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user + restaurant in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          role: data.restaurantName ? 'RESTAURANT_OWNER' : 'CUSTOMER',
        },
      });

      let restaurant = null;
      if (data.restaurantName) {
        const slug = data.restaurantName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

        restaurant = await tx.restaurant.create({
          data: {
            ownerId: user.id,
            name: data.restaurantName,
            slug: `${slug}-${Date.now()}`,
          },
        });
      }

      return { user, restaurant };
    });

    const accessToken = signAccessToken({
      userId: result.user.id,
      email: result.user.email,
      role: result.user.role,
      restaurantId: result.restaurant?.id,
    });
    const refreshToken = signRefreshToken({ userId: result.user.id });

    // Store refresh token
    await prisma.user.update({
      where: { id: result.user.id },
      data: { refreshToken },
    });

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      data: {
        accessToken,
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
          restaurantId: result.restaurant?.id,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Login ────────────────────────────────────────────────────────────────
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { restaurant: { select: { id: true } } },
    });
    if (!user) throw new AppError('Invalid email or password', 401);

    const passwordMatch = await bcrypt.compare(data.password, user.password);
    if (!passwordMatch) throw new AppError('Invalid email or password', 401);

    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      restaurantId: user.restaurant?.id,
    });
    const refreshToken = signRefreshToken({ userId: user.id });

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: {
        accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          restaurantId: user.restaurant?.id,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Refresh Token ─────────────────────────────────────────────────────────
export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) throw new AppError('Refresh token not found', 401);

    const payload = verifyRefreshToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { restaurant: { select: { id: true } } },
    });
    if (!user || user.refreshToken !== token) {
      throw new AppError('Invalid refresh token', 401);
    }

    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      restaurantId: user.restaurant?.id,
    });

    res.json({ success: true, data: { accessToken } });
  } catch (err) {
    next(err);
  }
};

// ─── Logout ───────────────────────────────────────────────────────────────
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user) {
      await prisma.user.update({
        where: { id: req.user.userId },
        data: { refreshToken: null },
      });
    }
    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

// ─── Get Current User ──────────────────────────────────────────────────────
export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
        restaurant: {
          select: { id: true, name: true, slug: true, logoUrl: true, isPremium: true },
        },
      },
    });
    if (!user) throw new AppError('User not found', 404);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
