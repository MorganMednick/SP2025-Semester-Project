import { StatusCodes } from 'http-status-codes';
import { sendError, sendSuccess } from '../util/responseUtils';
import { Request, Response } from 'express';
import { TicketMasterSearchParams } from '../types/shared/api/external/ticketMaster';
import { ticketMasterApiClient } from '../util/externalClientUtils';
import { EventData } from '../types/shared/api/external/eventData';

export const fetchTicketMasterEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const params: TicketMasterSearchParams = req.body;

    const response = await ticketMasterApiClient.get('events.json', {
      params: { ...params },
    });

    const eventsRaw = response.data?._embedded?.events || [];
    // TODO: Create Typing of raw ticketmaster response
    const events: EventData[] = eventsRaw.map((event: any) => ({
      event_name: event.name,
      price_min: event?.priceRanges?.[0]?.min || null,
      price_max: event?.priceRanges?.[0]?.max || null,
      seat_location: event?.seatmap?.staticUrl || null,
      event_location: event?._embedded?.venues?.[0]?.name || null,
      start_time: event?.dates?.start?.localDate || 'TBD',
      venue_seat_map: event?.seatmap?.staticUrl || null,
    }));

    sendSuccess(res, {
      statusCode: StatusCodes.OK,
      message: 'Fetched Ticketmaster Events',
      data: events,
    });
  } catch (error) {
    console.error('TicketMaster API Error:', error);
    sendError(res, { statusCode: StatusCodes.BAD_REQUEST, message: 'Error in Ticket Master Api Call.', error: error });
  }
};
