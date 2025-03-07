import axios from 'axios';
import { TM_API_KEY, TM_BASE_URL } from '../config/env';
import {
  RawTMEventData,
  TicketMasterSearchParams,
} from '../types/shared/api/external/ticketMaster';
import { OptionSource, PriceOption } from '@prisma/client';
import {
  EventData,
  SpecificEventData,
  TicketMasterQueryResponse,
} from '../types/shared/api/responses';

export const ticketMasterApiClient = axios.create({
  baseURL: TM_BASE_URL,
  params: { apikey: TM_API_KEY },
  headers: { 'Content-Type': 'application/json' },
});

ticketMasterApiClient.interceptors.request.use(logRequest);
ticketMasterApiClient.interceptors.response.use((response) => response, handleErrorResponse);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function logRequest(config: any) {
  const fullUrl = `${config.baseURL}${config.url}?${new URLSearchParams(config.params as Record<string, string>)}`;
  console.log(`[TicketMaster API Request] ${config.method?.toUpperCase()} ${fullUrl}`);
  return config;
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleErrorResponse(error: any) {
  const status = error?.response?.status || 'UNKNOWN';
  const statusText = error?.response?.statusText || 'No status text';
  const requestUrl = error?.config ? `${error.config.baseURL}${error.config.url}` : 'Unknown URL';

  return Promise.reject({
    status,
    request: `${error.config?.method?.toUpperCase()} ${requestUrl}`,
    statusText,
  });
}

export const handleTicketMasterEventRequest = async (
  params: TicketMasterSearchParams,
): Promise<TicketMasterQueryResponse> => {
  const response = await ticketMasterApiClient.get('events.json', { params });
  const eventsRaw: RawTMEventData[] = response.data?._embedded?.events || [];
  const finalResponse: TicketMasterQueryResponse = mapRawEventsToQueryResponse(eventsRaw);
  console.info(`[TicketMaster API Response] Fetched ${finalResponse.length} events`);
  return finalResponse;
};

function mapRawEventsToQueryResponse(rawTmEventData: RawTMEventData[]): TicketMasterQueryResponse {
  const eventMap: Map<string, EventData> = new Map();

  rawTmEventData.forEach((rawEvent) => {
    const eventOption = mapRawEventToOption(rawEvent);
    const eventName = rawEvent.name || 'Unknown Event';

    if (eventMap.has(eventName)) {
      eventMap.get(eventName)!.options.push(eventOption);
    } else {
      eventMap.set(eventName, {
        eventName,
        genre: rawEvent.classifications?.[0]?.genre?.name || 'Unknown Genre',
        coverImage: rawEvent.images[0].url || '',
        options: [eventOption],
      });
    }
  });

  return Array.from(eventMap.values());
}

function mapRawEventToOption(rawEvent: RawTMEventData): SpecificEventData {
  const ticketMasterId = rawEvent.id;
  return {
    eventName: rawEvent.name || 'Unknown Event',
    ticketMasterId,
    venueName: rawEvent?._embedded?.venues[0].name || 'Unknown Venue',
    address: rawEvent?._embedded?.venues[0].address?.line1 || 'Unknown Address',
    city: rawEvent?._embedded?.venues[0].city?.name || 'Unknown City',
    country: rawEvent?._embedded?.venues[0].country?.name || 'Unknown Country',
    startTime: safeDate(rawEvent.dates?.start?.dateTime),
    saleStart: safeDate(rawEvent.sales?.public?.startDateTime),
    saleEnd: safeDate(rawEvent.sales?.public?.endDateTime),
    seatMapSrc: rawEvent.seatmap?.staticUrl || '',
    currency: rawEvent.priceRanges?.[0]?.currency || 'USD',
    url: rawEvent.url || '',
    priceOptions: mapPriceRanges(ticketMasterId, rawEvent.priceRanges),
    watchers: [],
  };
}

function mapPriceRanges(
  eventId: string,
  priceRanges?: { min?: number; max?: number; currency?: string }[],
): PriceOption[] {
  return (
    priceRanges?.map((priceRange) => ({
      id: crypto.randomUUID(),
      eventOptionId: eventId,
      priceMin: priceRange.min !== undefined ? parseFloat(priceRange.min.toString()) : 0,
      priceMax: priceRange.max !== undefined ? parseFloat(priceRange.max.toString()) : 0,
      source: OptionSource.Ticketmaster,
    })) || []
  );
}

function safeDate(dateString?: string): Date {
  return dateString ? new Date(dateString) : new Date();
}
