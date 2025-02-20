import prisma from '../config/db';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../util/responseUtils';
import { User } from '@prisma/client';


export const getUserInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.session.userId; 

    if (!userId) {     
        sendError(res, {
            statusCode: StatusCodes.UNAUTHORIZED,
            message: 'User not logged in',
            error: null,
        });
    }
    // type User | null?
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true }, // Adjust fields as needed
    });

    if (!user) {
      sendError(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'User not found',
            error: null,
        });
    }

    //res.json(user);

    sendSuccess(res, {
        statusCode: StatusCodes.OK,
        message: 'Fetched user info',
        data: user,
      });

  } catch (error) {
    console.error('Error fetching user info:', error);
    sendError(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Error fetching user info.',
      error: error,
    });
  }
};
