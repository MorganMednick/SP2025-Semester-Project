import {
  RawTMEventData,
  TicketMasterSearchParams,
} from '../types/shared/api/external/ticketMaster';
import { PriceOptionSource, PriceOption } from '@prisma/client';
import {
  EventData,
  SpecificEventData,
  TicketMasterQueryResponse,
} from '../types/shared/api/responses';
import prisma from '../config/db';
import { ticketMasterApiClient } from '../config/tmClient';
import { logTicketMasterRequestInDatabase } from './dbUtils';
import { StatusCodes } from 'http-status-codes';

export const handleTicketMasterEventRequest = async (
  params: TicketMasterSearchParams,
): Promise<TicketMasterQueryResponse> => {
  const startOfReq = Date.now();
  const rawEvents = await fetchEventsFromTicketMaster(params);
  const responseTimeMs = Date.now() - startOfReq;

  const finalResponse = mapRawEventsToQueryResponse(rawEvents);

  // Intentionally leaving this as async, but it does not need to be updated before res yet.
  logTicketMasterRequestInDatabase(
    'events.json',
    finalResponse.length > 0 ? StatusCodes.OK : StatusCodes.NO_CONTENT,
    params,
    responseTimeMs,
    finalResponse.length,
  );

  return finalResponse;
};

// TODO: Decide when and how to approach db persistent events.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getCachedEvents(queryParams: string): Promise<TicketMasterQueryResponse | null> {
  const existingRequestLog = await prisma.requestLog.findUnique({
    where: { queryParams },
    include: {
      events: {
        include: {
          event: {
            include: {
              instances: {
                include: {
                  priceOptions: true,
                  watchers: {
                    include: { user: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (existingRequestLog) {
    console.info(`[Repeated Query] - Returning stored events for query: ${queryParams}`);
    return existingRequestLog.events.map((event) => event.event) as TicketMasterQueryResponse;
  }

  return null;
}

async function fetchEventsFromTicketMaster(
  params: TicketMasterSearchParams,
): Promise<RawTMEventData[]> {
  try {
    const response = await ticketMasterApiClient.get('events.json', { params });
    return response.data?._embedded?.events || [];
  } catch (error) {
    console.error(`Failed to fetch events from Ticketmaster: ${error}`);
    throw new Error('Failed to fetch events');
  }
}

function mapRawEventsToQueryResponse(rawEvents: RawTMEventData[]): TicketMasterQueryResponse {
  const eventMap = new Map<string, EventData>();

  rawEvents.forEach((rawEvent) => {
    const eventName = rawEvent.name || 'Unknown Event';
    const eventOption = mapRawEventToOption(rawEvent);

    if (eventMap.has(eventName)) {
      eventMap.get(eventName)?.instances.push(eventOption);
    } else {
      eventMap.set(eventName, {
        eventName,
        genre: rawEvent.classifications?.[0]?.genre?.name || 'Unknown Genre',
        coverImage: rawEvent.images?.[0]?.url || '',
        instanceCount: 1,
        instances: [eventOption],
      });
    }
  });

  return Array.from(eventMap.values());
}

function mapRawEventToOption(rawEvent: RawTMEventData): SpecificEventData {
  const venue = rawEvent._embedded?.venues?.[0];

  return {
    eventName: rawEvent.name || 'Unknown Event',
    ticketMasterId: rawEvent.id,
    venueName: venue?.name || 'Unknown Venue',
    address: venue?.address?.line1 || 'Unknown Address',
    city: venue?.city?.name || 'Unknown City',
    country: venue?.country?.name || 'Unknown Country',
    startTime: safeDate(rawEvent.dates?.start?.dateTime),
    saleStart: safeDate(rawEvent.sales?.public?.startDateTime),
    saleEnd: safeDate(rawEvent.sales?.public?.endDateTime),
    seatMapSrc: rawEvent.seatmap?.staticUrl || '',
    currency: rawEvent.priceRanges?.[0]?.currency || 'USD',
    url: rawEvent.url || '',
    priceOptions: mapPriceRanges(rawEvent.id, rawEvent.priceRanges),
    watchers: [],
  };
}

function mapPriceRanges(
  eventId: string,
  priceRanges?: { min?: number; max?: number; currency?: string }[],
): PriceOption[] {
  if (!priceRanges) return [];

  return priceRanges.map((priceRange) => ({
    id: crypto.randomUUID(),
    eventInstanceId: eventId,
    priceMin: priceRange.min !== undefined ? parseFloat(priceRange.min.toString()) : 0,
    priceMax: priceRange.max !== undefined ? parseFloat(priceRange.max.toString()) : 0,
    source: PriceOptionSource.Ticketmaster,
  }));
}

function safeDate(dateString?: string): Date {
  return dateString ? new Date(dateString) : new Date(0);
}
