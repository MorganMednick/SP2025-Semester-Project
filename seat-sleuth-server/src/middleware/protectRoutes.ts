import { Request, Response, NextFunction } from 'express';
import { sendError } from '../util/responseUtils';
import { StatusCodes } from 'http-status-codes';

export const protectRoutes = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    sendError(res, { statusCode: StatusCodes.UNAUTHORIZED, message: 'Failed user authentication from session' });
  }
  next();
};
