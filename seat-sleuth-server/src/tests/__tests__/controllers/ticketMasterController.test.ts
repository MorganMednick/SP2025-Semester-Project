import { Request, Response } from 'express';
import { fetchTicketMasterEvents } from '../../../controllers/ticketMasterController';
import { handleTicketMasterEventRequest } from '../../../util/ticketMasterUtils';
import { sendError, sendSuccess } from '../../../util/responseUtils';
import { StatusCodes } from 'http-status-codes';

jest.mock('../../../util/ticketMasterUtils', () => ({
  handleTicketMasterEventRequest: jest.fn(),
}));

jest.mock('../../../util/responseUtils', () => ({
  sendError: jest.fn(),
  sendSuccess: jest.fn(),
}));

describe('TicketMaster Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      body: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return a list of events when Ticketmaster request is successful', async () => {
    const mockParams = {
      keyword: 'Concert',
      city: 'Los Angeles',
    };

    const mockEvents = [
      {
        eventName: 'Test Event',
        genre: 'Music',
        coverImage: 'https://test-image.com',
        instanceCount: 1,
        instances: [
          {
            eventName: 'Test Event',
            ticketMasterId: '123',
            venueName: 'Test Venue',
            city: 'Los Angeles',
            country: 'United States',
            startTime: new Date('2025-01-01T20:00:00.000Z'),
            priceOptions: [],
            watchers: [],
          },
        ],
      },
    ];

    (mockRequest.body as any) = mockParams;
    (handleTicketMasterEventRequest as jest.Mock).mockResolvedValue(mockEvents);

    await fetchTicketMasterEvents(mockRequest as Request, mockResponse as Response);

    expect(handleTicketMasterEventRequest).toHaveBeenCalledWith(mockParams);
    expect(sendSuccess).toHaveBeenCalledWith(mockResponse, {
      statusCode: StatusCodes.OK,
      message: 'Fetched Ticketmaster Events',
      data: mockEvents,
    });
  });

  it('should return an empty array when Ticketmaster returns no events', async () => {
    const mockParams = {
      keyword: 'Empty Event',
    };

    (mockRequest.body as any) = mockParams;
    (handleTicketMasterEventRequest as jest.Mock).mockResolvedValue([]);

    await fetchTicketMasterEvents(mockRequest as Request, mockResponse as Response);

    expect(handleTicketMasterEventRequest).toHaveBeenCalledWith(mockParams);
    expect(sendSuccess).toHaveBeenCalledWith(mockResponse, {
      statusCode: StatusCodes.OK,
      message: 'Fetched Ticketmaster Events',
      data: [],
    });
  });

  it('should return a 400 error when Ticketmaster request fails', async () => {
    const mockParams = {
      keyword: 'Concert',
    };

    (mockRequest.body as any) = mockParams;
    (handleTicketMasterEventRequest as jest.Mock).mockRejectedValue(new Error('API error'));

    await fetchTicketMasterEvents(mockRequest as Request, mockResponse as Response);

    expect(handleTicketMasterEventRequest).toHaveBeenCalledWith(mockParams);
    expect(sendError).toHaveBeenCalledWith(mockResponse, {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Error in Ticket Master Api Call.',
      error: new Error('API error'),
    });
  });

  it('should handle missing body params gracefully', async () => {
    (mockRequest.body as any) = {};

    (handleTicketMasterEventRequest as jest.Mock).mockRejectedValue(new Error('Invalid params'));

    await fetchTicketMasterEvents(mockRequest as Request, mockResponse as Response);

    expect(handleTicketMasterEventRequest).toHaveBeenCalledWith({});
    expect(sendError).toHaveBeenCalledWith(mockResponse, {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Error in Ticket Master Api Call.',
      error: new Error('Invalid params'),
    });
  });
});
