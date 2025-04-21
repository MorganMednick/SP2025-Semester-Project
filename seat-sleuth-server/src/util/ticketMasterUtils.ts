import { RawTMEventData, TicketMasterSearchParams } from '../types/shared/ticketMaster';
import { EventData, PriceOption, SpecificEventData } from '../types/shared/responses';
import { ticketMasterApiClient } from '../config/tmClient';
import { logTicketMasterRequestInDatabase } from './dbUtils';
import { StatusCodes } from 'http-status-codes';
import crypto from 'crypto';

export const handleTicketMasterEventRequest = async (
  params: TicketMasterSearchParams,
): Promise<EventData[]> => {
  const startOfReq = Date.now();

  const rawEvents = await fetchEventsFromTicketMaster(params);
  const responseTimeMs = Date.now() - startOfReq;
  const finalResponse = mapRawEventsToQueryResponse(rawEvents);

  logTicketMasterRequestInDatabase(
    'events.json',
    finalResponse.length > 0 ? StatusCodes.OK : StatusCodes.NO_CONTENT,
    params,
    responseTimeMs,
    finalResponse.length,
  );

  return finalResponse;
};

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

function mapRawEventsToQueryResponse(rawEvents: RawTMEventData[]): EventData[] {
  return Array.from(
    rawEvents
      .reduce<Map<string, EventData>>((eventMap, rawEvent) => {
        const eventName = rawEvent.name || 'Unknown Event';
        const eventOption = mapRawEventToOption(rawEvent);

        if (eventMap.has(eventName)) {
          const existing = eventMap.get(eventName);
          existing?.instances.push(eventOption);
          if (existing) {
            existing.instanceCount += 1;
          }
        } else {
          eventMap.set(eventName, {
            eventName,
            genre: rawEvent.classifications?.[0]?.genre?.name || 'Unknown Genre',
            coverImage: findLargestImage(rawEvent.images),
            instanceCount: 1,
            instances: [eventOption],
          });
        }

        return eventMap;
      }, new Map<string, EventData>())
      .values(),
  );
}

function findLargestImage(images?: { url: string; width: number }[]): string {
  if (!images || images.length === 0) return '';
  let maxWidthImage = images[0];
  for (const image of images) {
    if (image.width > maxWidthImage.width) {
      maxWidthImage = image;
    }
  }

  return maxWidthImage.url;
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
    coverImage: findLargestImage(rawEvent.images),
    url: rawEvent.url || '',
    priceOptions: mapPriceRanges(rawEvent.id, rawEvent.priceRanges),
    watchers: [],
  };
}

function mapPriceRanges(
  eventId: string,
  priceRanges?: { min?: number; max?: number; currency?: string }[],
): PriceOption[] {
  if (!priceRanges || priceRanges.length === 0) return [];

  return priceRanges.map((range) => ({
    id: crypto.randomUUID(),
    eventInstanceId: eventId,
    price: range.min ?? 0,
    source: 'Ticketmaster',
    url: null,
  }));
}

function safeDate(dateString?: string): Date {
  return dateString ? new Date(dateString) : new Date(0);
}
