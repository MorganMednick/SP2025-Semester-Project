import { StatusCodes } from 'http-status-codes';
import { sendError, sendSuccess } from '../util/responseUtils';
import { Request, Response } from 'express';
import { TicketMasterSearchParams } from '../types/shared/ticketMaster';
import { handleTicketMasterEventRequest } from '../util/ticketMasterUtils';
import { EventData } from '../types/shared/responses';

export const fetchTicketMasterEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const params: TicketMasterSearchParams = req.body;

    const events: EventData[] = await handleTicketMasterEventRequest(params);

    sendSuccess(res, {
      statusCode: StatusCodes.OK,
      message: 'Fetched Ticketmaster Events',
      data: events,
    });
  } catch (error) {
    sendError(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Error in Ticket Master Api Call.',
      error: error,
    });
  }
};
