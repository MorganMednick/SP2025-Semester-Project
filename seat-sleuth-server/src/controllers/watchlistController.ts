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
            specificEvent: {
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

    // Map the data to EventData[]
    const eventMap: Map<string, EventData> = new Map();

    userWithWatchlist.watchlist.forEach(({ specificEvent }) => {
      if (!specificEvent) return;

      const eventId = specificEvent.ticketMasterId;

      // Map to SpecificEventData
      const mappedSpecificEvent: SpecificEventData = {
        ...specificEvent,
        watchers: specificEvent.watchers.map((watch) => ({
          ...watch,
          user: watch.user,
        })),
        priceOptions: specificEvent.priceOptions as PriceOption[],
      };

      if (eventMap.has(eventId)) {
        eventMap.get(eventId)!.options.push(mappedSpecificEvent);
      } else {
        eventMap.set(eventId, {
          ...specificEvent.event,
          options: [mappedSpecificEvent], // Now using SpecificEventData
        });
      }
    });

    const userWatchlist: GetWatchlistForUserResponse = Array.from(eventMap.values());

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

    // Check if event option exists
    const eventOption = await prisma.eventInstance.findUnique({
      where: { ticketMasterId: eventOptionId },
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

    // Check if entry exists in the watchlist
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
