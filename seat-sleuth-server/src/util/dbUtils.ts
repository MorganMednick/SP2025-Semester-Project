import { RequestLogEvent } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import prisma from '../config/db';
import { EventData } from '../types/shared/api/responses';

async function upsertRequestLog(requestLogData: {
  endpoint: string;
  queryParams: string;
  responseTimeMs: number;
  statusCode: StatusCodes;
}) {
  return await prisma.requestLog.upsert({
    where: { queryParams: requestLogData.queryParams },
    update: requestLogData,
    create: requestLogData,
  });
}

async function upsertEventMetaData(event: EventData) {
  return await prisma.eventMetaData.upsert({
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
}

async function linkEventToRequestLog(requestLogId: string, eventName: string) {
  const existingEventLog: RequestLogEvent | null = await prisma.requestLogEvent.findFirst({
    where: { eventName },
  });

  if (!existingEventLog) {
    await prisma.requestLogEvent.upsert({
      where: {
        requestLogId_eventName: {
          requestLogId,
          eventName,
        },
      },
      update: {
        requestLogId,
        eventName,
      },
      create: {
        requestLogId,
        eventName,
      },
    });
  }
}

async function upsertEventInstance(instance: EventData['instances'][0]) {
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
}

async function upsertPriceOptions(
  instanceId: string,
  priceOptions: EventData['instances'][0]['priceOptions'],
) {
  for (const priceOption of priceOptions) {
    await prisma.priceOption.upsert({
      where: {
        eventInstanceId_source: {
          eventInstanceId: instanceId,
          source: priceOption.source,
        },
      },
      update: {
        priceMin: priceOption.priceMin,
        priceMax: priceOption.priceMax,
      },
      create: {
        eventInstanceId: instanceId,
        priceMin: priceOption.priceMin,
        priceMax: priceOption.priceMax,
        source: priceOption.source,
      },
    });
  }
}

async function upsertWatchers(instanceId: string, watchers: EventData['instances'][0]['watchers']) {
  for (const watcher of watchers) {
    await prisma.watchedEvent.upsert({
      where: {
        userId_eventInstanceId: {
          userId: watcher.userId,
          eventInstanceId: instanceId,
        },
      },
      update: {},
      create: {
        userId: watcher.userId,
        eventInstanceId: instanceId,
      },
    });
  }
}

export async function persistEvents(
  eventData: EventData[],
  requestLogData: {
    endpoint: string;
    queryParams: string;
    responseTimeMs: number;
    statusCode: StatusCodes;
  },
): Promise<void> {
  const requestLog = await upsertRequestLog(requestLogData);

  for (const event of eventData) {
    const eventMetaData = await upsertEventMetaData(event);
    await linkEventToRequestLog(requestLog.id, eventMetaData.eventName);

    for (const instance of event.instances) {
      await upsertEventInstance(instance);
      await upsertPriceOptions(instance.ticketMasterId, instance.priceOptions);
      await upsertWatchers(instance.ticketMasterId, instance.watchers);
    }
  }
}
