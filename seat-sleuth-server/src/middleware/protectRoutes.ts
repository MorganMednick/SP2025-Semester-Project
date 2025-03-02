import { NextFunction, Request, Response } from 'express';
import { sendError } from '../util/responseUtils';
import { StatusCodes } from 'http-status-codes';

export const protectRoutes = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    sendError(res, {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'User not logged in',
      error: null,
    });
    return;
  }
  next();
};
