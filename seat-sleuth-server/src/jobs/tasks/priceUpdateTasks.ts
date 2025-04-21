import prisma from '../../config/db';
import { upsertPricesForWatchlistRecord } from '../../util/dbUtils';

export const updatePricesForPersistedEvents = async () => {
  console.info(`[SCHEDULED SCRAPER] Starting scheduled price scrape for all event records...`);

  const events = await prisma.eventInstance.findMany({
    include: {
      priceOptions: true,
      watchers: {
        include: { user: true },
      },
    },
  });

  for (const event of events) {
    try {
      await upsertPricesForWatchlistRecord(event);
    } catch (error) {
      console.error(
        `[SCHEDULED SCRAPER] Failed to update prices for event ${event.ticketMasterId}:`,
        error,
      );
    }
  }

  console.info(`[SCHEDULED SCRAPER] Completed scheduled price scrape.`);
};
