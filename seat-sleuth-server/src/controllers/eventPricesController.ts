import { StatusCodes } from "http-status-codes";
import { sendError } from "../util/responseUtils";
import { Request, Response } from "express";

export const fetchPricesForEvent = async (req: Request, res: Response): Promise<void> => {
  try {
  } catch (error) {
    console.error('Error fetching prices for event:', error);
    sendError(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Error fetching prices for event',
      error: error,
    });
  }
};
