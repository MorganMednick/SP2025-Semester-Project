import { StatusCodes } from 'http-status-codes';
import prisma from '../config/db';
import { EventInstance } from '@prisma/client';
import { SpecificEventData } from '../types/shared/responses';
import { TicketMasterQueryParams, AddToWatchListPayload } from '../types/shared/payloads';
import { scrapeStubHub } from '../services/stubHubScraper';
import { scrapeVividSeats } from '../services/vividSeatsScraper';

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
    where: { queryParams },
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

export const upsertPricesForWatchlistRecord = async (eventInstance: EventInstance) => {
  const scrapePayload = {
    eventName: eventInstance.eventName,
    eventDate: eventInstance.startTime,
  };

  const stubHubPrice = await scrapeStubHub(scrapePayload);
  if (stubHubPrice instanceof Error) {
    console.error(`StubHub scrape failed: ${stubHubPrice.message}`);
  } else if (stubHubPrice) {
    await prisma.priceOption.upsert({
      where: {
        eventInstanceId_source: {
          eventInstanceId: eventInstance.ticketMasterId,
          source: 'StubHub',
        },
      },
      update: {
        price: stubHubPrice.price,
        url: stubHubPrice.url,
      },
      create: {
        eventInstanceId: eventInstance.ticketMasterId,
        source: 'StubHub',
        price: stubHubPrice.price,
        url: stubHubPrice.url,
      },
    });
    console.info('StubHub price upsert completed.');
  } else {
    console.warn('No results returned from StubHub.');
  }

  const vividSeatsPrice = await scrapeVividSeats(scrapePayload);
  if (vividSeatsPrice instanceof Error) {
    console.error(`Vivid Seats scrape failed: ${vividSeatsPrice.message}`);
  } else if (vividSeatsPrice) {
    await prisma.priceOption.upsert({
      where: {
        eventInstanceId_source: {
          eventInstanceId: eventInstance.ticketMasterId,
          source: 'VividSeats',
        },
      },
      update: {
        price: vividSeatsPrice.price,
        url: vividSeatsPrice.url,
      },
      create: {
        eventInstanceId: eventInstance.ticketMasterId,
        source: 'VividSeats',
        price: vividSeatsPrice.price,
        url: vividSeatsPrice.url,
      },
    });
    console.info('Vivid Seats price upsert completed.');
  } else {
    console.warn('No results returned from Vivid Seats.');
  }

  console.info(
    `Price upsert completed for event: ${eventInstance.eventName} (ID: ${eventInstance.ticketMasterId})`,
  );
};

export const upsertWatchlistDataForEvent = async (
  initialRequestData: AddToWatchListPayload,
  userId?: number,
): Promise<boolean> => {
  const { eventInstanceId, event } = initialRequestData;

  if (!eventInstanceId || !event) {
    console.warn('Missing eventInstanceId or event in request payload.');
    return false;
  }

  const existingEventInstance = await prisma.eventInstance.findUnique({
    where: { ticketMasterId: eventInstanceId },
  });

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

  await prisma.eventMetaData.upsert({
    where: { eventName: event.eventName },
    update: {},
    create: eventMetaData,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const eventInstances = instances.map(({ priceOptions, watchers, ...instance }) => instance);

  const createdInstances = await prisma.eventInstance.createManyAndReturn({
    data: eventInstances,
    skipDuplicates: true,
  });

  for (const instance of createdInstances) {
    void upsertPricesForWatchlistRecord(instance);
  }

  if (userId) {
    await prisma.watchedEvent.upsert({
      where: {
        userId_eventInstanceId: { userId, eventInstanceId },
      },
      update: {},
      create: { userId, eventInstanceId },
    });
    return true;
  }

  return false;
};

export const getUserWithWatchlist = async (userId: number): Promise<SpecificEventData[]> => {
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

  if (!userWithWatchlist) {
    return [];
  }

  const response = userWithWatchlist.watchlist
    .filter((w) => w.eventInstance)
    .map(({ eventInstance }) => ({
      ...eventInstance,
      watchers: eventInstance.watchers.map((watch) => ({
        ...watch,
        user: watch.user,
      })),
      priceOptions: eventInstance.priceOptions,
      coverImage: eventInstance.event?.coverImage ?? null,
    }));

  console.info("User watchlist fetched successfully:", response)
  return response;
};
