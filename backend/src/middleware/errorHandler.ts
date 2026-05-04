import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // Prisma errors
  if (err.message.includes('Unique constraint')) {
    return res.status(409).json({
      success: false,
      error: 'A record with that value already exists.',
    });
  }

  if (err.message.includes('Record to update not found')) {
    return res.status(404).json({
      success: false,
      error: 'Resource not found.',
    });
  }

  // Unknown errors
  logger.error('Unhandled error:', { message: err.message, stack: err.stack });
  return res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
};

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Route not found' });
};
