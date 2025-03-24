import { StatusCodes } from 'http-status-codes';
import prisma from '../../../config/db';
import { logTicketMasterRequestInDatabase } from '../../../util/dbUtils';

jest.mock('../../../config/db', () => ({
  requestLog: {
    upsert: jest.fn(),
  },
}));

describe('DB Utils - logTicketMasterRequestInDatabase', () => {
  const mockParams = {
    keyword: 'Concert',
    city: ['Los Angeles'],
  };

  const mockRequestLog = {
    id: 'abc123',
    endpoint: 'events.json',
    statusCode: StatusCodes.OK,
    queryParams: 'keyword=Concert&city=Los%20Angeles',
    responseTimeMs: 200,
    hits: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'info').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create a new log entry if no existing record is found', async () => {
    const mockParams = {
      keyword: 'Concert',
      city: ['Los Angeles'],
    };

    (prisma.requestLog.upsert as jest.Mock).mockResolvedValue(mockRequestLog);

    await logTicketMasterRequestInDatabase('events.json', StatusCodes.OK, mockParams, 200, 5);

    expect(prisma.requestLog.upsert).toHaveBeenCalledWith({
      where: {
        queryParams: 'keyword=Concert&city=Los%20Angeles',
      },
      update: {
        statusCode: StatusCodes.OK,
        responseTimeMs: 200,
        hits: { increment: 1 },
      },
      create: {
        endpoint: 'events.json',
        statusCode: StatusCodes.OK,
        queryParams: 'keyword=Concert&city=Los%20Angeles',
        responseTimeMs: 200,
      },
    });
  });

  it('should update an existing log entry by incrementing hits', async () => {
    const updatedLog = { ...mockRequestLog, hits: 2 };

    (prisma.requestLog.upsert as jest.Mock).mockResolvedValue(updatedLog);

    await logTicketMasterRequestInDatabase('events.json', StatusCodes.OK, mockParams, 150, 10);

    expect(prisma.requestLog.upsert).toHaveBeenCalledWith({
      where: {
        queryParams: 'keyword=Concert&city=Los%20Angeles',
      },
      update: {
        statusCode: StatusCodes.OK,
        responseTimeMs: 150,
        hits: { increment: 1 },
      },
      create: {
        endpoint: 'events.json',
        statusCode: StatusCodes.OK,
        queryParams: 'keyword=Concert&city=Los%20Angeles',
        responseTimeMs: 150,
      },
    });

    expect(console.info).toHaveBeenCalledWith('[TicketMaster Request Summary]', {
      ...updatedLog,
      eventCount: 10,
    });
  });

  it('should handle empty params gracefully', async () => {
    const emptyParams = {};
    const expectedQueryParams = '';

    (prisma.requestLog.upsert as jest.Mock).mockResolvedValue(mockRequestLog);

    await logTicketMasterRequestInDatabase('events.json', StatusCodes.OK, emptyParams, 100, 0);

    expect(prisma.requestLog.upsert).toHaveBeenCalledWith({
      where: {
        queryParams: expectedQueryParams,
      },
      update: {
        statusCode: StatusCodes.OK,
        responseTimeMs: 100,
        hits: { increment: 1 },
      },
      create: {
        endpoint: 'events.json',
        statusCode: StatusCodes.OK,
        queryParams: expectedQueryParams,
        responseTimeMs: 100,
      },
    });

    expect(console.info).toHaveBeenCalledWith('[TicketMaster Request Summary]', {
      ...mockRequestLog,
      eventCount: 0,
    });
  });

  it('should throw an error if Prisma upsert fails', async () => {
    const mockError = new Error('Database error');

    (prisma.requestLog.upsert as jest.Mock).mockRejectedValue(mockError);

    await expect(
      logTicketMasterRequestInDatabase('events.json', StatusCodes.OK, mockParams, 300, 1),
    ).rejects.toThrow('Database error');

    expect(prisma.requestLog.upsert).toHaveBeenCalledWith({
      where: {
        queryParams: 'keyword=Concert&city=Los%20Angeles',
      },
      update: {
        statusCode: StatusCodes.OK,
        responseTimeMs: 300,
        hits: { increment: 1 },
      },
      create: {
        endpoint: 'events.json',
        statusCode: StatusCodes.OK,
        queryParams: 'keyword=Concert&city=Los%20Angeles',
        responseTimeMs: 300,
      },
    });

    expect(console.info).not.toHaveBeenCalled();
  });
});
