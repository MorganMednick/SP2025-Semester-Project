import axios from 'axios';
import { TM_API_KEY, TM_BASE_URL } from '../config/env';
import {
  RawTMEventData,
  TicketMasterSearchParams,
} from '../types/shared/api/external/ticketMaster';
import { OptionSource, PriceOption } from '@prisma/client';
import {
  EventOptionData,
  EventWithOptions,
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
  // eslint-disable-next-line @typescript-eslint/consistent-generic-constructors
  const eventMap: Map<string, EventWithOptions> = new Map();

  rawTmEventData.forEach((rawEvent) => {
    const eventOption = mapRawEventToOption(rawEvent); // This for embedded stuffies - J
    const eventName = eventOption.event.eventName;

    if (eventMap.has(eventName)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      eventMap.get(eventName)!.options.push(eventOption);
    } else {
      eventMap.set(eventName, {
        id: rawEvent.id,
        eventName,
        genre: rawEvent.classifications?.[0]?.genre?.name ?? null,
        imageSrc: rawEvent.images.map((img) => img.url) || [],
        options: [eventOption],
      });
    }
  });

  return Array.from(eventMap.values());
}

function mapRawEventToOption(rawEvent: RawTMEventData): EventOptionData {
  const { id, name, url, classifications, priceRanges, seatmap, sales, _embedded, dates, images } =
    rawEvent;

  return {
    id,
    eventId: '',
    venueName: _embedded?.venues?.[0]?.name ?? 'Unknown Venue',
    address: _embedded?.venues?.[0]?.address?.line1 ?? '',
    city: _embedded?.venues?.[0]?.city?.name ?? 'Unknown City',
    country: _embedded?.venues?.[0]?.country?.name ?? 'Unknown Country',
    startTime: dates?.start?.dateTime ? new Date(dates.start.dateTime) : new Date(),
    saleStart: sales?.public?.startDateTime ? new Date(sales.public.startDateTime) : null,
    saleEnd: sales?.public?.endDateTime ? new Date(sales.public.endDateTime) : null,
    seatMapSrc: seatmap?.staticUrl ?? null,
    currency: priceRanges?.[0]?.currency ?? null,
    url: url ?? null,
    priceOptions: mapPriceRanges(id, priceRanges), // This for embedded stuffies - J
    event: {
      id,
      eventName: name,
      genre: classifications?.[0]?.genre?.name ?? null,
      imageSrc: images.map((img) => img.url) || [],
    },
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
    })) ?? []
  );
}
