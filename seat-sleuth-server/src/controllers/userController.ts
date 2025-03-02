import prisma from '../config/db';
import bcryptjs from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../util/responseUtils';
import { User } from '@prisma/client';
import { BCRYPT_SALT_ROUNDS } from '../data/constants';

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

    const user: User | null = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      sendError(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'User not found',
        error: null,
      });
    }
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

export const updateUserInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      sendError(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'User not logged in',
        error: null,
      });
    }

    const { name, email, notif } = req.body;

    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        notif,
      },
    });

    sendSuccess(res, {
      statusCode: StatusCodes.OK,
      message: 'Updated user info',
    });
  } catch (error) {
    console.error('Error updating user info:', error);
    sendError(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Error updating user info.',
      error: error,
    });
  }
};

export const updatePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      sendError(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'User not logged in',
        error: null,
      });
    }

    const { oldPassword, newPassword } = req.body;

    const user: User | null = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      sendError(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'User not found',
        error: null,
      });
      return;
    }

    const isPasswordValid: boolean = await bcryptjs.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      sendError(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Current password incorrect',
        error: null,
      });
      return;
    }

    const hashedPassword = await bcryptjs.hash(newPassword, BCRYPT_SALT_ROUNDS);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    sendSuccess(res, {
      statusCode: StatusCodes.OK,
      message: 'Password changed succfully',
    });
  } catch (error) {
    sendError(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'An error occurred trying to update password',
      error,
    });
  }
};
