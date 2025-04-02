
import { StatusCodes } from 'http-status-codes';
import { sendError, sendSuccess } from '../util/responseUtils';
import { Request, Response } from 'express';
import { scrapeStubHub } from '../services/stubHubScraper';
import { StubHubScrapePayload } from '../types/shared/api/payloads';

export const scrapeStubHubController = async (req: Request, res: Response): Promise<void> => {
  try {
    const  query: StubHubScrapePayload = req.body;
    const url = "https://www.stubhub.com/secure/Search?q="+query.name?.replace(/\s+/g, "+");; 
    const result = await scrapeStubHub(url, query.city);

    sendSuccess(res, {
      statusCode: StatusCodes.OK,
      message: 'Fetched StubHub details',
      data: result,
    });
  } catch (error) {
    sendError(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Error trying to scrape StubHub',
      error: error,
    });
  }
};
