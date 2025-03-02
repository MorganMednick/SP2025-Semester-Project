import prisma from '../config/db';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../util/responseUtils';
import { Event, UserWatchlist } from '@prisma/client';
import { handleTicketMasterEventRequest } from '../util/ticketMasterUtils';
import { UserWatchListEntry, UserWithWatchList } from '../types/shared/api/responses';
import { AddToWatchListPayload, RemoveFromWatchListPayload } from '../types/shared/api/payloads';

export const getUserWatchList = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: number | undefined = req.session.userId;
    if (!userId) {
      sendError(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'User not logged in',
        error: null,
      });
      return;
    }

    const userWithWatchlist: UserWithWatchList = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        watchlist: {
          include: {
            event: true,
            watchedPrices: true,
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

    const userWatchlist: UserWatchListEntry[] = userWithWatchlist.watchlist.map((entry) => ({
      event: entry.event,
      watchedPrices: entry.watchedPrices ?? [],
    }));

    sendSuccess(res, {
      statusCode: StatusCodes.OK,
      data: userWatchlist,
      message: 'Watchlist successfully fetched',
    });
  } catch (error: unknown) {
    console.error('Error fetching user watchlist:', error);
    sendError(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Error fetching user watchlist.',
      error,
    });
  }
};

export const addToWatchList = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: number | undefined = req.session.userId;
    if (!userId) {
      sendError(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'User not logged in',
        error: null,
      });
      return;
    }

    const { eventId, startingPrice, ticketSite }: AddToWatchListPayload = req.body;

    if (!eventId || startingPrice === undefined || !ticketSite) {
      sendError(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Event ID, starting price, and ticket site are required',
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

    const watchlistEntry: UserWatchlist = await prisma.userWatchlist.upsert({
      where: {
        userId_eventId: { userId, eventId: event.id },
      },
      update: {},
      create: {
        userId,
        eventId: event.id,
      },
    });


    const existingWatchedPrice = await prisma.watchedPrice.findFirst({
      where: {
        watchlistId: watchlistEntry.id,
        ticketSite,
      },
    });

    if (!existingWatchedPrice) {
      const newWatchedPrice = await prisma.watchedPrice.create({
        data: {
          watchlistId: watchlistEntry.id,
          startingPrice,
          currentPrice: startingPrice,
          ticketSite,
        },
      });
      console.info(`Added watched price for event: ${eventId}, ticket site: ${ticketSite}`, newWatchedPrice);
    }

    sendSuccess(res, {
      statusCode: StatusCodes.OK,
      message: 'Event added to watchlist with price tracking',
    });
  } catch (error: unknown) {
    console.error('Error adding event to watchlist:', error);
    sendError(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Error adding event to watchlist.',
      error,
    });
  }
};

export const removeFromWatchList = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: number | undefined = req.session.userId;
    if (!userId) {
      sendError(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'User not logged in',
        error: null,
      });
      return;
    }

    const { eventId }: RemoveFromWatchListPayload = req.body;

    if (!eventId) {
      sendError(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Event ID is required',
        error: null,
      });
      return;
    }

    const watchlistEntry = await prisma.userWatchlist.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
      include: {
        watchedPrices: true,
      },
    });

    console.info(`Deleting watchlist entry for user: ${userId}:`, watchlistEntry);

    if (!watchlistEntry) {
      sendError(res, {
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Watchlist entry not found',
        error: null,
      });
      return;
    }


    await prisma.watchedPrice.deleteMany({
      where: { watchlistId: watchlistEntry.id },
    });


    await prisma.userWatchlist.delete({
      where: {
        userId_eventId: { userId, eventId },
      },
    });

    sendSuccess(res, {
      statusCode: StatusCodes.OK,
      message: 'Event removed from watchlist',
    });
  } catch (error: unknown) {
    console.error('Error removing event from watchlist:', error);
    sendError(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Error removing event from watchlist.',
      error,
    });
  }
};
