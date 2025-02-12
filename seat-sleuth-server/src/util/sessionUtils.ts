import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendError, sendSuccess } from './responseUtils';

export const destroySessionAndClearCookies = (req: Request, res: Response): void => {
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
