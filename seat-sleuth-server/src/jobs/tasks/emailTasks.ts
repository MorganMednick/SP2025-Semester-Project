import { WatchedEvent } from '@prisma/client';
import prisma from '../../config/db';
import { sendEmail } from '../../config/emailClient';
import { getHtmlBodyForWatchlistPriceUpdate } from '../emailTemplates/emailTemplate';

export const sendwatchlistUpdateEmail = async () => {
  console.info(`[SCHEDULED EMAIL] Starting scheduled email for watchlist updates...`);

  const users = await prisma.user.findMany({
    include: { watchlist: true },
  });

  for (const user of users) {
    await handleUserWatchlist(user.email, user.watchlist);
  }
};

const handleUserWatchlist = async (email: string, watchlist: WatchedEvent[]) => {
  for (const watchRelation of watchlist) {
    const event = await getEventWithLowestPrice(watchRelation.eventInstanceId);
    if (!event) continue;

    await sendWatchlistEmail(email, event);
  }
};

const getEventWithLowestPrice = async (ticketMasterId: string) => {
  const event = await prisma.eventInstance.findUnique({
    where: { ticketMasterId },
    include: { priceOptions: true },
  });

  if (!event || event.priceOptions.length === 0) return null;

  const lowestPrice = event.priceOptions.reduce(
    (min, opt) => (opt.price < min ? opt.price : min),
    Infinity,
  );

  return { ...event, lowestPrice };
};

const sendWatchlistEmail = async (
  email: string,
  event: Awaited<ReturnType<typeof getEventWithLowestPrice>>,
) => {
  if (!event) return;

  const subject = `${event.eventName} Price Update`;
  const body = getHtmlBodyForWatchlistPriceUpdate(
    event.eventName,
    event.lowestPrice.toFixed(2),
    event.startTime.toDateString(),
  );

  console.info(`[SCHEDULED EMAIL] Sending "${subject}" to ${email}`);

  const result = await sendEmail([email], subject, body);

  if (result) {
    console.info(`[SCHEDULED EMAIL] Successfully sent update for ${event.eventName} to ${email}`);
  } else {
    console.error(`[SCHEDULED EMAIL] Failed to send update for ${event.eventName} to ${email}`);
  }
};
