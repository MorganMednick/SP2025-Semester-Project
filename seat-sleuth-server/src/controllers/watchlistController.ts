import prisma from '../config/db';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../util/responseUtils';
import { AddToWatchListPayload, RemoveFromWatchListPayload } from '../types/shared/api/payloads';
import {
  EventData,
  SpecificEventData,
  GetWatchlistForUserResponse,
} from '../types/shared/api/responses';
import { PriceOption } from '@prisma/client';
import { upsertWatchlistDataForEvent } from '../util/dbUtils';

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
    const userWithWatchlist = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        watchlist: {
          include: {
            eventInstance: {
              include: {
                event: true,
                priceOptions: true,
                watchers: {
                  include: { user: true },
                },
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

    const eventMap: Map<string, EventData> = new Map<string, EventData>();

    userWithWatchlist.watchlist.forEach(({ eventInstance }) => {
      if (!eventInstance) return;

      const eventId = eventInstance.ticketMasterId;

      // Map to SpecificEventData
      const mappedSpecificEvent: SpecificEventData = {
        ...eventInstance,
        watchers: eventInstance.watchers.map((watch) => ({
          ...watch,
          user: watch.user,
        })),
        priceOptions: eventInstance.priceOptions as PriceOption[],
      };

      if (eventMap.has(eventId)) {
        const existingEvent = eventMap.get(eventId);
        if (existingEvent) existingEvent.instances.push(mappedSpecificEvent);
      } else {
        eventMap.set(eventId, {
          ...eventInstance.event,
          instances: [mappedSpecificEvent], // Now using SpecificEventData
        });
      }
    });

    const userWatchlist: GetWatchlistForUserResponse = Array.from(eventMap.values());

    console.info(`Fetched ${userWatchlist.length} watchlist for user:`, userWatchlist);

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

    const initialRequestData: AddToWatchListPayload = req.body;

    const upsertOk = await upsertWatchlistDataForEvent(initialRequestData, userId);

    if (upsertOk) {
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
    if (!userId) {
      sendError(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'User not logged in',
      });
      return;
    }

    const { eventInstanceId }: RemoveFromWatchListPayload = req.body;
    if (!eventInstanceId) {
      sendError(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Event Option ID is required',
      });
      return;
    }

    // Check if entry exists in the watchlist
    const watchlistEntry = await prisma.watchedEvent.findUnique({
      where: {
        userId_eventInstanceId: { userId, eventInstanceId },
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
        userId_eventInstanceId: { userId, eventInstanceId },
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
