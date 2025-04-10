import prisma from '../config/db';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../util/responseUtils';
import { AddToWatchListPayload, RemoveFromWatchListPayload } from '../types/shared/payloads';
import { EventData } from '../types/shared/responses';
import { getUserWithWatchlist, upsertWatchlistDataForEvent } from '../util/dbUtils';

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

    // Fetch user watchlist with necessary relations
    const userWithWatchlist: EventData[] = await getUserWithWatchlist(userId);

    const userWatchlist: EventData[] = userWithWatchlist;

    console.info(`Fetched ${userWatchlist.length} watchlist for user`);

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
    const payload: AddToWatchListPayload = req.body;

    if (!userId) {
      sendError(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'User not logged in',
      });
      return;
    }

    console.info(
      `[WATCHLIST][ADD] Attempting to add event (${payload.eventInstanceId}) to watchlist for user (${userId})`,
    );

    const upsertOk = await upsertWatchlistDataForEvent(payload, userId);

    if (upsertOk) {
      console.info(
        `[WATCHLIST][ADD] Successfully added event (${payload.eventInstanceId}) to watchlist for user (${userId})`,
      );
      sendSuccess(res, {
        statusCode: StatusCodes.OK,
        message: 'Event created and added to watchlist',
      });
    } else {
      sendError(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Event failed to add to watchlist',
      });
    }
  } catch (error) {
    console.error('[WATCHLIST][ADD] Internal server error:', error);
    sendError(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Failed to add event to watchlist.',
      error,
    });
  }
};

export const removeFromWatchList = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.session.userId;
    const { eventInstanceId }: RemoveFromWatchListPayload = req.body;

    if (!userId) {
      sendError(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'User not logged in',
      });
      return;
    }

    if (!eventInstanceId) {
      sendError(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Event Option ID is required',
      });
      return;
    }

    console.info(
      `[WATCHLIST][REMOVE] Attempting to remove event (${eventInstanceId}) from watchlist for user (${userId})`,
    );

    const watchlistEntry = await prisma.watchedEvent.findUnique({
      where: {
        userId_eventInstanceId: { userId, eventInstanceId },
      },
    });

    if (!watchlistEntry) {
      console.warn(
        `[WATCHLIST][REMOVE] No watchlist entry found for user (${userId}) and event (${eventInstanceId})`,
      );
      sendError(res, {
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Watchlist entry not found',
      });
      return;
    }

    await prisma.watchedEvent.delete({
      where: {
        userId_eventInstanceId: { userId, eventInstanceId },
      },
    });

    console.info(
      `[WATCHLIST][REMOVE] Successfully removed event (${eventInstanceId}) from watchlist for user (${userId})`,
    );
    sendSuccess(res, {
      statusCode: StatusCodes.OK,
      message: 'Event option removed from watchlist',
    });
  } catch (error) {
    console.error('[WATCHLIST][REMOVE] Internal server error:', error);
    sendError(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Error removing event option from watchlist.',
      error,
    });
  }
};

export const isUserWatching = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.session.userId;
    const { eventInstanceId } = req.body;

    if (!userId) {
      console.warn('[WATCHLIST][CHECK] Unauthorized request - no userId in session');
      sendError(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'User not logged in',
      });
      return;
    }

    if (!eventInstanceId) {
      console.warn('[WATCHLIST][CHECK] Missing eventInstanceId in request body');
      sendError(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'No included event to check is user is watching event.',
      });
      return;
    }

    const existingWatchlistRecord = await prisma.watchedEvent.findUnique({
      where: {
        userId_eventInstanceId: { userId, eventInstanceId },
      },
    });

    if (!existingWatchlistRecord) {
      sendError(res, {
        message: 'No existing watchlist record for user',
        statusCode: StatusCodes.NOT_ACCEPTABLE,
      });
      return;
    }

    console.info(`[WATCHLIST][CHECK] User (${userId}) is watching event (${eventInstanceId})`);
    sendSuccess(res, {
      message: `User watchlist relation exists for event with id: ${eventInstanceId}`,
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    console.error('[WATCHLIST][CHECK] Internal server error:', error);
    sendError(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Error checking if user is watching event.',
      error,
    });
  }
};
