import { StatusCodes } from 'http-status-codes';
import { AddToWatchListPayload, TicketMasterQueryParams } from '../types/shared/api/payloads';
import prisma from '../config/db';
import { EventInstance, PriceOption } from '@prisma/client';
import { EventData, SpecificEventData } from '../types/shared/api/responses';

export async function logTicketMasterRequestInDatabase(
  endpoint: string,
  statusCode: StatusCodes,
  params: TicketMasterQueryParams,
  responseTimeMs: number,
  eventCount: number,
) {
  const queryParams: string = new URLSearchParams(params as Record<string, string>)
    .toString()
    .replace(/\+/g, '%20');

  const newRequestLog = await prisma.requestLog.upsert({
    where: {
      queryParams,
    },
    update: {
      statusCode,
      responseTimeMs,
      hits: { increment: 1 },
    },
    create: {
      endpoint,
      statusCode,
      queryParams,
      responseTimeMs,
    },
  });
  console.info(`[TicketMaster Request Summary]`, { ...newRequestLog, eventCount });
}

export const upsertWatchlistDataForEvent = async (
  initialRequestData: AddToWatchListPayload,
  userId?: number,
): Promise<boolean> => {
  const { eventInstanceId, event } = initialRequestData;

  if (!eventInstanceId || !event) {
    return false;
  }

  const existingEventInstance = await prisma.eventInstance.findUnique({
    where: { ticketMasterId: eventInstanceId },
  });

  // IF EVENT EXISTS, JUST ADD USER TO WATCHLIST VIA UPSERT IN CASE RELATION IS ALREADY THERE
  if (existingEventInstance && userId) {
    await prisma.watchedEvent.upsert({
      where: {
        userId_eventInstanceId: { userId, eventInstanceId },
      },
      update: {},
      create: { userId, eventInstanceId },
    });
    return true;
  }

  const { instances, ...eventMetaData } = event;

  // CREATE META DATA
  await prisma.eventMetaData.upsert({
    where: { eventName: event.eventName },
    update: {},
    create: eventMetaData,
  });

  // CREATE INSTANCES
  const eventInstances: EventInstance[] = instances.map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ priceOptions, watchers, ...instanceData }) => ({
      ...instanceData,
    }),
  );
  const createdInstances = await prisma.eventInstance.createManyAndReturn({
    data: eventInstances,
    skipDuplicates: true,
  });

  // CREATE PRICE OPTIONS FOR SPECIFIC EVENT INSTANCES
  for (let i = 0; i < createdInstances.length; i++) {
    const instance: EventInstance = createdInstances[i];
    const { priceOptions } = instances[i];
    for (const priceRange of priceOptions) {
      await prisma.priceOption.upsert({
        where: {
          eventInstanceId_source: {
            eventInstanceId: instance.ticketMasterId,
            source: priceRange.source,
          },
        },
        update: {},
        create: {
          ...priceRange,
          eventInstanceId: instance.ticketMasterId,
        },
      });
    }
  }

  // MAP TO WATCHLIST IF USER ID PASSED (SHOULD BE BLOCKED OTHERWISE BECAUSE ROUTE IS PROTECTED)
  if (userId) {
    await prisma.watchedEvent.create({
      data: {
        userId,
        eventInstanceId,
      },
    });
    return true;
  }
  return false;
};

export const getUserWithWatchlist = async (userId: number): Promise<EventData[]> => {
  const userWithWatchlist = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      watchlist: {
        include: {
          eventInstance: {
            include: {
              event: true,
              priceOptions: true,
              watchers: {
                include: { user: true },
              },
            },
          },
        },
      },
    },
  });

  const eventMap: Map<string, EventData> = new Map<string, EventData>();

  userWithWatchlist?.watchlist.forEach(({ eventInstance }) => {
    if (!eventInstance) return;

    const eventId = eventInstance.ticketMasterId;

    // Map to SpecificEventData
    const mappedSpecificEvent: SpecificEventData = {
      ...eventInstance,
      watchers: eventInstance.watchers.map((watch) => ({
        ...watch,
        user: watch.user,
      })),
      priceOptions: eventInstance.priceOptions as PriceOption[],
    };

    if (eventMap.has(eventId)) {
      const existingEvent = eventMap.get(eventId);
      if (existingEvent) existingEvent.instances.push(mappedSpecificEvent);
    } else {
      eventMap.set(eventId, {
        ...eventInstance.event,
        instances: [mappedSpecificEvent], // Now using SpecificEventData
      });
    }
  });

  return Array.from(eventMap.values()) || [];
};
