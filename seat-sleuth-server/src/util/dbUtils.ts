import { StatusCodes } from 'http-status-codes';
import { TicketMasterQueryParams } from '../types/shared/api/payloads';
import prisma from '../config/db';

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
