import axios from 'axios';
import { TM_API_KEY, TM_BASE_URL } from '../config/env';
import {
  EventImage,
  RawTMEventData,
  TicketMasterSearchParams,
} from '../types/shared/api/external/ticketMaster';
import { Event } from '@prisma/client';

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
): Promise<Event[]> => {
  const response = await ticketMasterApiClient.get('events.json', {
    params: { ...params },
  });
  const eventsRaw: RawTMEventData[] = response.data?._embedded?.events || [];
  const events: Event[] = eventsRaw.map(
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
      priceMin: priceRanges?.[0]?.min ?? null,
      priceMax: priceRanges?.[0]?.max ?? null,
      currency: priceRanges?.[0]?.currency ?? null,
      name,
      seatLocation: seatmap?.staticUrl ?? null,
      startTime: dates?.start?.localDate ?? 'TBD',
      venueName: _embedded?.venues?.[0]?.name ?? null,
      venueAddressOne: _embedded?.venues?.[0]?.address?.line1 ?? null,
      venueAddressTwo: _embedded?.venues?.[0]?.address?.line2 ?? null,
      venueSeatMapSrc: seatmap?.staticUrl ?? null,
      city: _embedded?.venues?.[0]?.city?.name ?? 'Unknown',
      country: _embedded?.venues?.[0]?.country?.name ?? 'Unknown',
      url: url ?? null,
      genre: classifications?.[0]?.genre?.name ?? null,
      saleStart: sales?.public?.startDateTime ?? null,
      saleEnd: sales?.public?.endDateTime ?? null,
      imageSrc: images
        ? images.map((image: EventImage) => {
            return image.url;
          })
        : [],
    }),
  );

  return events;
};
