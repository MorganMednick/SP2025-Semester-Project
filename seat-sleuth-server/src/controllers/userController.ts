import prisma from '../config/db';
import bcryptjs from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../util/responseUtils';
import { Event, User } from '@prisma/client';
import { BCRYPT_SALT_ROUNDS } from '../data/constants';
import { handleTicketMasterEventRequest } from '../util/ticketMasterUtils';

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

export const getUserWatchList = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      sendError(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'User not logged in',
        error: null,
      });
      return;
    }

    const userWithWatchlist = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        watchlist: {
          include: {
            event: true,
          },
        },
      },
    });

    if (!userWithWatchlist) {
      sendError(res, {
        statusCode: StatusCodes.NOT_FOUND,
        message: 'User not found',
        error: null,
      });
      return;
    }

    const userWatchlist: Event[] = userWithWatchlist.watchlist.map((entry) => entry.event);

    sendSuccess(res, {
      statusCode: StatusCodes.OK,
      data: userWatchlist,
      message: 'Watchlist successfully feteched',
    });
  } catch (error) {
    console.error('Error updating user watchlist:', error);
    sendError(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Error updating user watchlist.',
      error: error,
    });
  }
};

export const addToWatchList = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      sendError(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'User not logged in',
        error: null,
      });
      return;
    }

    const { eventId } = req.body;

    if (!eventId) {
      sendError(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Event ID is required',
        error: null,
      });
      return;
    }

    const events: Event[] = await handleTicketMasterEventRequest({ id: eventId });
    const event: Event | undefined = events?.[0];

    if (!event) {
      sendError(res, {
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Event not found',
        error: null,
      });
      return;
    }

    await prisma.event.upsert({
      where: { id: event.id },
      update: {},
      create: event,
    });

    await prisma.userWatchlist.upsert({
      where: {
        userId_eventId: { userId, eventId: event.id },
      },
      update: {},
      create: {
        userId,
        eventId: event.id,
      },
    });

    sendSuccess(res, {
      statusCode: StatusCodes.OK,
      message: 'Event added to watchlist',
    });
  } catch (error) {
    console.error('Error updating user watchlist:', error);
    sendError(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Error updating user watchlist.',
      error,
    });
  }
};
