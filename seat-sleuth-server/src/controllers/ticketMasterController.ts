import { StatusCodes } from 'http-status-codes';
import { sendError, sendSuccess } from '../util/responseUtils';
import { Request, Response } from 'express';
import {
  EventImage,
  RawTMEventData,
  TicketMasterSearchParams,
} from '../types/shared/api/external/ticketMaster';
import { ticketMasterApiClient } from '../util/externalClientUtils';
import { EventData } from '../types/shared/api/external/eventData';

export const fetchTicketMasterEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const params: TicketMasterSearchParams = req.body;

    const response = await ticketMasterApiClient.get('events.json', {
      params: { ...params },
    });

    const eventsRaw: RawTMEventData[] = response.data?._embedded?.events || [];
    const events: EventData[] = eventsRaw.map(
      ({
        id,
        name,
        url,
        classifications,
        priceRanges,
        seatmap,
        sales,
        _embedded,
        dates,
        images,
      }: RawTMEventData) => ({
        id,
        priceMin: priceRanges?.[0]?.min ?? undefined,
        priceMax: priceRanges?.[0]?.max ?? undefined,
        currency: priceRanges?.[0]?.currency ?? undefined,
        name,
        seatLocation: seatmap?.staticUrl ?? undefined,
        startTime: dates?.start?.localDate ?? 'TBD',
        venueName: _embedded?.venues?.[0]?.name ?? undefined,
        venueAddressOne: _embedded?.venues?.[0]?.address?.line1 ?? undefined,
        venueAddressTwo: _embedded?.venues?.[0]?.address?.line2 ?? undefined,
        venueSeatMapSrc: seatmap?.staticUrl ?? undefined,
        city: _embedded?.venues?.[0]?.city?.name ?? 'Unknown',
        country: _embedded?.venues?.[0]?.country?.name ?? 'Unknown',
        url: url ?? undefined,
        genre: classifications?.[0]?.genre?.name ?? undefined,
        saleStart: sales?.public?.startDateTime ?? undefined,
        saleEnd: sales?.public?.endDateTime ?? undefined,
        imageSrc: images
          ? images.map((image: EventImage) => {
              return image.url;
            })
          : undefined,
      }),
    );

    sendSuccess(res, {
      statusCode: StatusCodes.OK,
      message: 'Fetched Ticketmaster Events',
      data: events,
    });
  } catch (error) {
    console.error('TicketMaster API Error:', error);
    sendError(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Error in Ticket Master Api Call.',
      error: error,
    });
  }
};
