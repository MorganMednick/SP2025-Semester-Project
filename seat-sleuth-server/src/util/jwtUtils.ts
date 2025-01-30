import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';
const JWT_EXPIRES_IN = '1h';
const JWT_SECRET_FALLBACK = 'ymx9SkZEsLm6CCG5WsMmB6VGbSsHGeiktuZIcT5gwENzwTEh1Bg73aZrwOULZ/336pIQXTL86yHo/Yb5g8Qi2w==';
/**
 * Generates a JWT token for authentication.
 * @param userId - The user's ID to embed in the token.
 * @returns A signed JWT token.
 */
export function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET || JWT_SECRET_FALLBACK, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verifies and decodes a JWT token.
 * @param token - The JWT token to verify.
 * @returns The decoded payload if valid, or null if invalid.
 */
export function verifyToken(token: string): any | null {
  try {
    return jwt.verify(token, JWT_SECRET || JWT_SECRET_FALLBACK);
  } catch (error) {
    return null;
  }
}
