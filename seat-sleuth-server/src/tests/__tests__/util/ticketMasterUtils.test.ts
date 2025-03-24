import { handleTicketMasterEventRequest } from '../../../util/ticketMasterUtils';
import { ticketMasterApiClient } from '../../../config/tmClient';
import { logTicketMasterRequestInDatabase } from '../../../util/dbUtils';
import { StatusCodes } from 'http-status-codes';
import { PriceOptionSource } from '@prisma/client';

jest.mock('../../../config/tmClient', () => ({
  ticketMasterApiClient: {
    get: jest.fn(),
  },
}));

jest.mock('../../../util/dbUtils', () => ({
  logTicketMasterRequestInDatabase: jest.fn(),
}));

describe('TicketMaster Utils', () => {
  const mockParams = {
    keyword: 'Concert',
  };

  const mockRawEvent = {
    id: '123',
    name: 'Test Event',
    url: 'https://test-event.com',
    priceRanges: [{ min: 50, max: 100, currency: 'USD' }],
    classifications: [{ genre: { name: 'Music' } }],
    images: [{ url: 'https://test-image.com' }],
    seatmap: { staticUrl: 'https://test-seatmap.com' },
    _embedded: {
      venues: [
        {
          name: 'Test Venue',
          address: { line1: '123 Test St' },
          city: { name: 'Test City' },
          country: { name: 'Test Country' },
        },
      ],
    },
    dates: {
      start: { dateTime: '2025-01-01T20:00:00.000Z' },
    },
    sales: {
      public: {
        startDateTime: '2024-12-01T20:00:00.000Z',
        endDateTime: '2025-01-01T22:00:00.000Z',
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle a successful request and return mapped events', async () => {
    (ticketMasterApiClient.get as jest.Mock).mockResolvedValue({
      data: { _embedded: { events: [mockRawEvent] } },
    });

    const result = await handleTicketMasterEventRequest(mockParams);

    expect(ticketMasterApiClient.get).toHaveBeenCalledWith('events.json', { params: mockParams });
    expect(result).toHaveLength(1);
    expect(result[0].eventName).toBe('Test Event');
    expect(result[0].instances[0].priceOptions[0]).toEqual(
      expect.objectContaining({
        priceMin: 50,
        priceMax: 100,
        source: PriceOptionSource.Ticketmaster,
      }),
    );

    expect(logTicketMasterRequestInDatabase).toHaveBeenCalledWith(
      'events.json',
      StatusCodes.OK,
      mockParams,
      expect.any(Number),
      1,
    );
  });

  it('should return an empty array if no events are returned', async () => {
    (ticketMasterApiClient.get as jest.Mock).mockResolvedValue({
      data: { _embedded: { events: [] } },
    });

    const result = await handleTicketMasterEventRequest(mockParams);

    expect(result).toEqual([]);
    expect(logTicketMasterRequestInDatabase).toHaveBeenCalledWith(
      'events.json',
      StatusCodes.NO_CONTENT,
      mockParams,
      expect.any(Number),
      0,
    );
  });

  it('should throw an error if Ticketmaster API fails', async () => {
    (ticketMasterApiClient.get as jest.Mock).mockRejectedValue(new Error('API Error'));

    await expect(handleTicketMasterEventRequest(mockParams)).rejects.toThrow(
      'Failed to fetch events',
    );
  });

  it('should map raw event to a valid option', async () => {
    (ticketMasterApiClient.get as jest.Mock).mockResolvedValue({
      data: { _embedded: { events: [mockRawEvent] } },
    });

    const result = await handleTicketMasterEventRequest(mockParams);

    expect(result).toBeDefined();
    expect(result[0].eventName).toBe(mockRawEvent.name);
    expect(result[0].instances[0].priceOptions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          priceMin: 50,
          priceMax: 100,
          source: PriceOptionSource.Ticketmaster,
        }),
      ]),
    );
  });

  it('should handle missing optional fields gracefully', async () => {
    const incompleteRawEvent = {
      ...mockRawEvent,
      priceRanges: undefined,
      classifications: undefined,
      _embedded: undefined,
    };

    (ticketMasterApiClient.get as jest.Mock).mockResolvedValue({
      data: { _embedded: { events: [incompleteRawEvent] } },
    });

    const result = await handleTicketMasterEventRequest({ ...mockParams, id: '123' });

    expect(result).toBeDefined();
    expect(result[0].eventName).toBe('Test Event');
    expect(result[0].instances[0].priceOptions).toEqual([]);
  });

  it('should map valid price ranges', async () => {
    (ticketMasterApiClient.get as jest.Mock).mockResolvedValue({
      data: { _embedded: { events: [mockRawEvent] } },
    });

    const result = await handleTicketMasterEventRequest(mockParams);

    expect(result[0].instances[0].priceOptions[0]).toEqual(
      expect.objectContaining({
        priceMin: 50,
        priceMax: 100,
        source: PriceOptionSource.Ticketmaster,
      }),
    );
  });

  it('should return an empty array for invalid price ranges', async () => {
    const invalidEvent = {
      ...mockRawEvent,
      priceRanges: [],
    };

    (ticketMasterApiClient.get as jest.Mock).mockResolvedValue({
      data: { _embedded: { events: [invalidEvent] } },
    });

    const result = await handleTicketMasterEventRequest(mockParams);

    expect(result[0].instances[0].priceOptions).toEqual([]);
  });

  it('should correctly group events by name and increase instance count', async () => {
    (ticketMasterApiClient.get as jest.Mock).mockResolvedValue({
      data: { _embedded: { events: [mockRawEvent, mockRawEvent] } },
    });

    const result = await handleTicketMasterEventRequest(mockParams);

    expect(result).toHaveLength(1);
    expect(result[0].instanceCount).toBe(2);
  });

  it('should handle an empty rawEvents array', async () => {
    (ticketMasterApiClient.get as jest.Mock).mockResolvedValue({
      data: { _embedded: { events: [] } },
    });

    const result = await handleTicketMasterEventRequest(mockParams);

    expect(result).toEqual([]);
  });

  it('should handle unknown fields gracefully', async () => {
    const corruptedEvent = {
      ...mockRawEvent,
      id: undefined,
      name: undefined,
    };

    (ticketMasterApiClient.get as jest.Mock).mockResolvedValue({
      data: { _embedded: { events: [corruptedEvent] } },
    });

    const result = await handleTicketMasterEventRequest(mockParams);

    expect(result[0].eventName).toBe('Unknown Event');
  });
});
