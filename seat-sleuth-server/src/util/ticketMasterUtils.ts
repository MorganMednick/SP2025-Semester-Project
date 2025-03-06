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
  params: {
    apikey: TM_API_KEY,
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

ticketMasterApiClient.interceptors.request.use((config) => {
  const fullUrl = `${config.baseURL}${config.url}?${new URLSearchParams(config.params as Record<string, string>)}`;
  console.log(`[TicketMaster API Request] ${config.method?.toUpperCase()} ${fullUrl}`);
  return config;
});

ticketMasterApiClient.interceptors.response.use(
  (response) => {
    console.info(
      `[TicketMaster API Success] ${response.config.method?.toUpperCase()} ${response.config.baseURL}${response.config.url} - STATUS: ${response.status}`,
    );
    return response;
  },
  (error) => {
    const status = error?.response?.status || 'UNKNOWN';
    const statusText = error?.response?.statusText || 'No status text';
    const requestUrl = error?.config ? `${error.config.baseURL}${error.config.url}` : 'Unknown URL';
    return Promise.reject({
      status,
      request: `${error.config?.method?.toUpperCase()} ${requestUrl}`,
      statusText,
    });
  },
);

export const handleTicketMasterEventRequest = async (
  params: TicketMasterSearchParams,
): Promise<TicketMasterQueryResponse> => {
  const response = await ticketMasterApiClient.get('events.json', {
    params: { ...params },
  });

  const eventsRaw: RawTMEventData[] = response.data?._embedded?.events || [];

  const eventMap: Map<string, EventWithOptions> = new Map();

  eventsRaw.forEach((rawEvent) => {
    const {
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
    } = rawEvent;

    const startTime = dates?.start?.dateTime ? new Date(dates.start.dateTime) : null;
    const saleStart = sales?.public?.startDateTime ? new Date(sales.public.startDateTime) : null;
    const saleEnd = sales?.public?.endDateTime ? new Date(sales.public.endDateTime) : null;

    const priceOptions: PriceOption[] =
      priceRanges?.map((priceRange) => ({
        id: crypto.randomUUID(),
        eventOptionId: id,
        priceMin: priceRange.min !== undefined ? parseFloat(priceRange.min.toString()) : 0,
        priceMax: priceRange.max !== undefined ? parseFloat(priceRange.max.toString()) : 0,
        source: OptionSource.Ticketmaster,
      })) ?? [];

    const eventOption: EventOptionData = {
      id,
      eventId: '',
      venueName: _embedded?.venues?.[0]?.name ?? 'Unknown Venue',
      address: _embedded?.venues?.[0]?.address?.line1 ?? '',
      city: _embedded?.venues?.[0]?.city?.name ?? 'Unknown City',
      country: _embedded?.venues?.[0]?.country?.name ?? 'Unknown Country',
      startTime: startTime ?? new Date(),
      saleStart,
      saleEnd,
      seatMapSrc: seatmap?.staticUrl ?? null,
      currency: priceRanges?.[0]?.currency ?? null,
      url: url ?? null,
      priceOptions,
      event: {
        id,
        eventName: name,
        genre: classifications?.[0]?.genre?.name ?? null,
        imageSrc: images.map((img) => img.url) || [],
      },
    };

    if (eventMap.has(name)) {
      eventMap.get(name)!.options.push(eventOption);
    } else {
      eventMap.set(name, {
        id,
        eventName: name,
        genre: classifications?.[0]?.genre?.name ?? null,
        imageSrc: images.map((img) => img.url) || [],
        options: [eventOption],
      });
    }
  });
  const finalEventsArray: TicketMasterQueryResponse = Array.from(eventMap.values());

  console.log(finalEventsArray.find((evt) => evt.eventName === 'Remi Wolf')?.options.length);
  console.log(finalEventsArray);
  return finalEventsArray;
};
