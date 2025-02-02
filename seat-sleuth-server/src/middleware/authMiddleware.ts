import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../util/jwtUtils';
import { sendError } from '../util/responseUtils';
import { StatusCodes } from 'http-status-codes';

/** TODO: THIS IS STILL UNTESTED. It will be used to protect routes eventually - J
 * Middleware to authenticate requests using a JWT token.
 *
 * This function checks for a valid JWT token in the `Authorization` header.
 * If the token is missing, invalid, or expired, it returns an `Unauthorized` error.
 * Otherwise, it attaches the decoded user information to the `req.user` object.
 *
 * @param req - The incoming request object, which should include an `Authorization` header in the format `Bearer <token>`.
 * @param res - The response object, used to send an error response if authentication fails.
 * @param next - The next middleware function in the Express pipeline, called if authentication succeeds.
 * @returns If authentication fails, returns an error response with `401 Unauthorized`. Otherwise, calls `next()` to proceed.
 */
export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return sendError(res, {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'Access denied. No token provided.'
    });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return sendError(res, {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'Invalid or expired token.'
    });
  }

  (req as any).user = decoded;
  next();
}
