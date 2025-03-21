import { StatusCodes } from 'http-status-codes';
import { sendError, sendSuccess } from '../util/responseUtils';
import { Request, Response } from 'express';
import { handleSeatGeekEventRequest } from '../util/seatGeekUtils';
import { SeatGeekSearchParams } from '../types/shared/api/external/seatGeek';

export const fetchSeatGeekEventUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const params: SeatGeekSearchParams = req.body;

    const seatGeekUrl: string = await handleSeatGeekEventRequest(params);

    sendSuccess(res, {
      statusCode: StatusCodes.OK,
      message: 'Fetched SeatGeek Events',
      data: seatGeekUrl,
    });
  } catch (error) {
    sendError(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Error in SeatGeek Api Call.',
      error: error,
    });
  }
};
