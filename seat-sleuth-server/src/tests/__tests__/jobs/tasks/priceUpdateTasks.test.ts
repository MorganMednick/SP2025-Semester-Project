import prisma from '../../../../config/db';
import { updatePricesForPersistedEvents } from '../../../../jobs/tasks/priceUpdateTasks';
import { upsertPricesForWatchlistRecord } from '../../../../util/dbUtils';

jest.mock('../../../../config/db', () => ({
  __esModule: true,
  default: {
    eventInstance: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock('../../../../util/dbUtils', () => ({
  upsertPricesForWatchlistRecord: jest.fn(),
}));

describe('updatePricesForPersistedEvents', () => {
  const mockEvents = [
    {
      ticketMasterId: 'event-1',
      eventName: 'Event One',
      priceOptions: [],
      watchers: [],
    },
    {
      ticketMasterId: 'event-2',
      eventName: 'Event Two',
      priceOptions: [],
      watchers: [],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (prisma.eventInstance.findMany as jest.Mock).mockResolvedValue(mockEvents);
  });

  it('should fetch all events and call upsertPricesForWatchlistRecord for each', async () => {
    await updatePricesForPersistedEvents();

    expect(prisma.eventInstance.findMany).toHaveBeenCalledWith({
      include: {
        priceOptions: true,
        watchers: {
          include: { user: true },
        },
      },
    });

    expect(upsertPricesForWatchlistRecord).toHaveBeenCalledTimes(mockEvents.length);
    expect(upsertPricesForWatchlistRecord).toHaveBeenCalledWith(mockEvents[0]);
    expect(upsertPricesForWatchlistRecord).toHaveBeenCalledWith(mockEvents[1]);
  });

  it('should log error and continue if upsert fails for an event', async () => {
    (upsertPricesForWatchlistRecord as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Scrape failed');
    });

    await updatePricesForPersistedEvents();

    // It should attempt both events even if one fails
    expect(upsertPricesForWatchlistRecord).toHaveBeenCalledTimes(2);
  });
});
