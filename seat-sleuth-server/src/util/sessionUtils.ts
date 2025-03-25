import { StatusCodes } from 'http-status-codes';
import { sendSuccess, sendError } from './responseUtils';
import { Request, Response } from 'express';

export const destroySessionAndClearCookies = (req: Request, res: Response): void => {
  if (!req.session) {
    res.clearCookie('connect.sid', { path: '/' });
    sendError(res, {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'User not logged in',
      error: null,
    });
    return;
  }

  req.session.destroy((err) => {
    if (err) {
      console.error('Logout Error:', err);
      sendError(res, {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Error logging out',
        error: err,
      });
      return;
    }

    res.clearCookie('connect.sid', { path: '/' });
    sendSuccess(res, {
      statusCode: StatusCodes.OK,
      message: 'Logout successful',
    });
  });
};
