import prisma from '../config/db';
import bcryptjs from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../util/responseUtils';
import { Event, User } from '@prisma/client';
import { BCRYPT_SALT_ROUNDS } from '../data/constants';
import { EventImage, RawTMEventData } from '../types/shared/api/external/ticketMaster';
import { ticketMasterApiClient } from '../util/externalClientUtils';

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

    const response = await ticketMasterApiClient.get('events.json', {
      params: { id: eventId },
    });

    const eventsRaw: RawTMEventData[] = response.data?._embedded?.events || [];

    if (eventsRaw.length === 0) {
      sendError(res, {
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Event not found',
        error: null,
      });
      return;
    }

    // Temporary. Jayce you need to fix this you idiot.
    const event: Event = {
      id: eventsRaw?.[0].id,
      priceMin: eventsRaw?.[0].priceRanges?.[0]?.min ?? null,
      priceMax: eventsRaw?.[0].priceRanges?.[0]?.max ?? null,
      currency: eventsRaw?.[0].priceRanges?.[0]?.currency ?? null,
      name: eventsRaw?.[0].name,
      seatLocation: eventsRaw?.[0].seatmap?.staticUrl ?? null,
      startTime: new Date(),
      venueName: eventsRaw?.[0]._embedded?.venues?.[0]?.name ?? null,
      venueAddressOne: eventsRaw?.[0]._embedded?.venues?.[0]?.address?.line1 ?? null,
      venueAddressTwo: eventsRaw?.[0]._embedded?.venues?.[0]?.address?.line2 ?? null,
      venueSeatMapSrc: eventsRaw?.[0].seatmap?.staticUrl ?? null,
      city: eventsRaw?.[0]._embedded?.venues?.[0]?.city?.name ?? 'Unknown',
      country: eventsRaw?.[0]._embedded?.venues?.[0]?.country?.name ?? 'Unknown',
      url: eventsRaw?.[0].url ?? undefined,
      genre: eventsRaw?.[0].classifications?.[0]?.genre?.name ?? null,
      saleStart: new Date(),
      saleEnd: new Date(),
      imageSrc: eventsRaw?.[0].images?.map((image: EventImage) => image.url) ?? undefined,
    };

    await prisma.event.upsert({
      where: { id: event.id },
      update: {},
      create: event,
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        watchlist: {
          connect: { id: event.id },
        },
      },
    });

    sendSuccess(res, {
      statusCode: StatusCodes.OK,
      message: 'Event added to watchlist',
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
