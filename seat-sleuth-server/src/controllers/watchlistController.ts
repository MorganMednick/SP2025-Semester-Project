import prisma from '../config/db';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../util/responseUtils';
import { AddToWatchListPayload, RemoveFromWatchListPayload } from '../types/shared/api/payloads';
import { EventOptionData } from '../types/shared/api/responses';

export const getUserWatchList = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      sendError(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'User not authenticated',
      });
      return;
    }

    const userWithWatchlist = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        watchlist: {
          include: {
            eventOption: {
              include: {
                event: true,
                priceOptions: true,
              },
            },
          },
        },
      },
    });

    if (!userWithWatchlist) {
      sendError(res, {
        statusCode: StatusCodes.NOT_FOUND,
        message: 'User not found',
      });
      return;
    }

    const userWatchlist: EventOptionData[] = userWithWatchlist.watchlist.map(
      (entry) => entry.eventOption,
    );

    console.info('User watchlist:', userWatchlist);

    sendSuccess(res, {
      statusCode: StatusCodes.OK,
      data: userWatchlist,
      message: 'Watchlist successfully fetched',
    });
  } catch (error) {
    console.error('Error fetching user watchlist:', error);
    sendError(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Error fetching user watchlist.',
      error,
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
      });
      return;
    }

    const { eventOptionId }: AddToWatchListPayload = req.body;
    if (!eventOptionId) {
      sendError(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Event Option ID is required',
      });
      return;
    }

    const eventOption = await prisma.eventOption.findUnique({
      where: { id: eventOptionId },
    });

    if (!eventOption) {
      sendError(res, {
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Event Option not found',
      });
      return;
    }

    await prisma.watchedEvent.upsert({
      where: {
        userId_eventOptionId: { userId, eventOptionId },
      },
      update: {},
      create: { userId, eventOptionId },
    });

    sendSuccess(res, {
      statusCode: StatusCodes.OK,
      message: 'Event option added to watchlist',
    });
  } catch (error) {
    console.error('Error adding event option to watchlist:', error);
    sendError(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Error adding event option to watchlist.',
      error,
    });
  }
};

export const removeFromWatchList = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      sendError(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'User not logged in',
      });
      return;
    }

    const { eventOptionId }: RemoveFromWatchListPayload = req.body;
    if (!eventOptionId) {
      sendError(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Event Option ID is required',
      });
      return;
    }

    const watchlistEntry = await prisma.watchedEvent.findUnique({
      where: {
        userId_eventOptionId: { userId, eventOptionId },
      },
    });

    if (!watchlistEntry) {
      sendError(res, {
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Watchlist entry not found',
      });
      return;
    }

    await prisma.watchedEvent.delete({
      where: {
        userId_eventOptionId: { userId, eventOptionId },
      },
    });

    sendSuccess(res, {
      statusCode: StatusCodes.OK,
      message: 'Event option removed from watchlist',
    });
  } catch (error) {
    console.error('Error removing event option from watchlist:', error);
    sendError(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Error removing event option from watchlist.',
      error,
    });
  }
};
