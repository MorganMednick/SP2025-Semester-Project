import axios from 'axios';
import { TM_API_KEY, TM_BASE_URL } from '../config/env';
import {
  RawTMEventData,
  TicketMasterSearchParams,
} from '../types/shared/api/external/ticketMaster';
import { PriceOptionSource, PriceOption, RequestLogEvent } from '@prisma/client';
import {
  EventData,
  SpecificEventData,
  TicketMasterQueryResponse,
} from '../types/shared/api/responses';
import prisma from '../config/db';
import { StatusCodes } from 'http-status-codes';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export async function persistEvents(
  eventData: TicketMasterQueryResponse,
  requestLogData: {
    endpoint: string;
    queryParams: string;
    responseTimeMs: number;
    statusCode: StatusCodes;
  },
): Promise<void> {
  const requestLog = await prisma.requestLog.upsert({
    where: {
      queryParams: requestLogData.queryParams,
    },
    update: {
      ...requestLogData,
    },
    create: {
      ...requestLogData,
    },
  });
  for (const event of eventData) {
    const eventMetaData = await prisma.eventMetaData.upsert({
      where: { eventName: event.eventName },
      update: {
        genre: event.genre,
        coverImage: event.coverImage,
        instanceCount: event.instances.length,
      },
      create: {
        eventName: event.eventName,
        genre: event.genre,
        coverImage: event.coverImage,
        instanceCount: event.instances.length,
      },
    });

    const existingEventLog: RequestLogEvent | null = await prisma.requestLogEvent.findFirst({
      where: { eventName: event.eventName },
    });

    if (!existingEventLog) {
      await prisma.requestLogEvent.upsert({
        where: {
          requestLogId_eventName: {
            requestLogId: requestLog.id,
            eventName: eventMetaData.eventName,
          },
        },
        update: {
          requestLogId: requestLog.id,
          eventName: eventMetaData.eventName,
        },
        create: {
          requestLogId: requestLog.id,
          eventName: eventMetaData.eventName,
        },
      });
    }

    for (const instance of event.instances) {
      await prisma.eventInstance.upsert({
        where: { ticketMasterId: instance.ticketMasterId },
        update: {
          eventName: instance.eventName,
          venueName: instance.venueName,
          address: instance.address,
          seatMapSrc: instance.seatMapSrc,
          city: instance.city,
          country: instance.country,
          url: instance.url,
          currency: instance.currency,
          startTime: instance.startTime,
          saleStart: instance.saleStart,
          saleEnd: instance.saleEnd,
        },
        create: {
          ticketMasterId: instance.ticketMasterId,
          eventName: instance.eventName,
          venueName: instance.venueName,
          address: instance.address,
          seatMapSrc: instance.seatMapSrc,
          city: instance.city,
          country: instance.country,
          url: instance.url,
          currency: instance.currency,
          startTime: instance.startTime,
          saleStart: instance.saleStart,
          saleEnd: instance.saleEnd,
        },
      });

      for (const priceOption of instance.priceOptions) {
        await prisma.priceOption.upsert({
          where: {
            eventInstanceId_source: {
              eventInstanceId: instance.ticketMasterId,
              source: priceOption.source,
            },
          },
          update: {
            priceMin: priceOption.priceMin,
            priceMax: priceOption.priceMax,
          },
          create: {
            eventInstanceId: instance.ticketMasterId,
            priceMin: priceOption.priceMin,
            priceMax: priceOption.priceMax,
            source: priceOption.source,
          },
        });
      }

      for (const watcher of instance.watchers) {
        await prisma.watchedEvent.upsert({
          where: {
            userId_eventInstanceId: {
              userId: watcher.userId,
              eventInstanceId: instance.ticketMasterId,
            },
          },
          update: {},
          create: {
            userId: watcher.userId,
            eventInstanceId: instance.ticketMasterId,
          },
        });
      }
    }
  }
}

export const handleTicketMasterEventRequest = async (
  params: TicketMasterSearchParams,
): Promise<TicketMasterQueryResponse> => {
  const queryParams: string = new URLSearchParams(params as Record<string, string>).toString();
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
                    include: {
                      user: true,
                    },
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
    const events = existingRequestLog.events.map(
      (event) => event.event,
    ) as TicketMasterQueryResponse;
    return events;
  }

  const startOfReq = new Date();
  const response = await ticketMasterApiClient.get('events.json', { params });
  const endOfReq = new Date();

  const eventsRaw: RawTMEventData[] = response.data?._embedded?.events || [];
  const finalResponse: TicketMasterQueryResponse = mapRawEventsToQueryResponse(eventsRaw);

  const requestLogData = {
    endpoint: 'events.json',
    queryParams,
    responseTimeMs: endOfReq.getTime() - startOfReq.getTime(),
    statusCode: StatusCodes.OK,
  };

  await persistEvents(finalResponse, requestLogData);

  console.info(
    `[TicketMaster API Response] Fetched ${finalResponse.length} events in ${requestLogData.responseTimeMs} ms`,
  );
  return finalResponse;
};

function mapRawEventsToQueryResponse(rawTmEventData: RawTMEventData[]): TicketMasterQueryResponse {
  const eventMap: Map<string, EventData> = new Map<string, EventData>();

  rawTmEventData.forEach((rawEvent) => {
    const eventOption = mapRawEventToOption(rawEvent);
    const eventName = rawEvent.name || 'Unknown Event';

    if (eventMap.has(eventName)) {
      const existingEvent = eventMap.get(eventName);
      if (existingEvent && 'options' in existingEvent) existingEvent?.instances.push(eventOption);
    } else {
      const newEventData: EventData = {
        eventName,
        genre: rawEvent.classifications?.[0]?.genre?.name || 'Unknown Genre',
        coverImage: rawEvent.images[0].url || '',
        instanceCount: 1,
        instances: [eventOption],
      };
      eventMap.set(eventName, newEventData);
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
      eventInstanceId: eventId,
      priceMin: priceRange.min !== undefined ? parseFloat(priceRange.min.toString()) : 0,
      priceMax: priceRange.max !== undefined ? parseFloat(priceRange.max.toString()) : 0,
      source: PriceOptionSource.Ticketmaster,
    })) || []
  );
}

function safeDate(dateString?: string): Date {
  return dateString ? new Date(dateString) : new Date();
}
