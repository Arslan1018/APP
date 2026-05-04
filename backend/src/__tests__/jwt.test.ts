import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from '../src/config/jwt';

// Set env vars before tests
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';

describe('JWT Utilities', () => {
  const payload = {
    userId: 'user-123',
    email: 'test@test.com',
    role: 'RESTAURANT_OWNER' as const,
    restaurantId: 'rest-456',
  };

  it('should sign and verify access token', () => {
    const token = signAccessToken(payload);
    expect(token).toBeTruthy();
    const decoded = verifyAccessToken(token);
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe(payload.role);
  });

  it('should sign and verify refresh token', () => {
    const token = signRefreshToken({ userId: payload.userId });
    expect(token).toBeTruthy();
    const decoded = verifyRefreshToken(token);
    expect(decoded.userId).toBe(payload.userId);
  });

  it('should throw on invalid access token', () => {
    expect(() => verifyAccessToken('invalid.token.here')).toThrow();
  });

  it('should throw on invalid refresh token', () => {
    expect(() => verifyRefreshToken('bad-token')).toThrow();
  });
});

describe('AppError', () => {
  it('should create error with statusCode', async () => {
    const { AppError } = await import('../src/middleware/errorHandler');
    const err = new AppError('Not found', 404);
    expect(err.message).toBe('Not found');
    expect(err.statusCode).toBe(404);
    expect(err.isOperational).toBe(true);
  });
});
