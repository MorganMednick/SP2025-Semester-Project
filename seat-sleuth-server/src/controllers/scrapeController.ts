import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../util/responseUtils';
import { scrapeStubHub } from '../services/stubHubScraper';
import { scrapeVividSeats } from '../services/vividSeatsScraper';

export const scrapeStubHubForPrice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventName, eventDate } = req.body;

    if (!eventName || !eventDate) {
      sendError(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Event name and target location are required.',
      });
      return;
    }

    const scrapingRes = await scrapeStubHub({ eventName, eventDate });

    if (scrapingRes instanceof Error) {
      sendError(res, {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: scrapingRes.message,
        error: scrapingRes,
      });
      return;
    }

    if (scrapingRes === null) {
      sendError(res, {
        statusCode: StatusCodes.NOT_FOUND,
        message: 'No price found on StubHub.',
      });
      return;
    }

    sendSuccess(res, {
      statusCode: StatusCodes.OK,
      message: 'Scraping successful.',
      data: scrapingRes,
    });
  } catch (error) {
    sendError(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Error in StubHub scraping.',
      error: error,
    });
  }
};

export const scrapeVividSeatsForPrice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventName, eventDate } = req.body;

    if (!eventName || !eventDate) {
      sendError(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Event name and eventDate are required.',
      });
      return;
    }

    const scrapingRes = await scrapeVividSeats({ eventName, eventDate });

    if (scrapingRes instanceof Error) {
      sendError(res, {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: scrapingRes.message,
        error: scrapingRes,
      });
      return;
    }

    if (scrapingRes === null) {
      sendError(res, {
        statusCode: StatusCodes.NOT_FOUND,
        message: 'No price found on VividSeats.',
      });
      return;
    }

    sendSuccess(res, {
      statusCode: StatusCodes.OK,
      message: 'Scraping successful.',
      data: scrapingRes,
    });
  } catch (error) {
    sendError(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Error in VividSeats scraping.',
      error: error,
    });
  }
};
