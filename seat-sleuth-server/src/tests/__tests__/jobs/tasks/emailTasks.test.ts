import prisma from '../../../../config/db';
import { sendEmail } from '../../../../config/emailClient';
import { getHtmlBodyForWatchlistPriceUpdate } from '../../../../jobs/emailTemplates/emailTemplate';
import { sendwatchlistUpdateEmail } from '../../../../jobs/tasks/emailTasks';

jest.mock('../../../../config/db', () => ({
  __esModule: true,
  default: {
    user: { findMany: jest.fn() },
    eventInstance: { findUnique: jest.fn() },
  },
}));

jest.mock('../../../../config/emailClient', () => ({
  sendEmail: jest.fn(),
}));

jest.mock('../../../../jobs/emailTemplates/emailTemplate', () => ({
  getHtmlBodyForWatchlistPriceUpdate: jest.fn(() => '<html>Email Body</html>'),
}));

describe('sendwatchlistUpdateEmail', () => {
  const mockUsers = [
    {
      email: 'test@example.com',
      watchlist: [
        {
          eventInstanceId: 'event-123',
        },
      ],
    },
  ];

  const mockEvent = {
    eventName: 'Mock Concert',
    startTime: new Date('2025-04-01T18:00:00Z'),
    priceOptions: [{ priceMin: 120 }, { priceMin: 100 }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
    (prisma.eventInstance.findUnique as jest.Mock).mockResolvedValue(mockEvent);
    (sendEmail as jest.Mock).mockResolvedValue('mocked-email-id');
  });

  it('sends an email for each user and event', async () => {
    await sendwatchlistUpdateEmail();

    expect(prisma.user.findMany).toHaveBeenCalled();
    expect(prisma.eventInstance.findUnique).toHaveBeenCalledWith({
      where: { ticketMasterId: 'event-123' },
      include: { priceOptions: true },
    });

    expect(getHtmlBodyForWatchlistPriceUpdate).toHaveBeenCalledWith(
      'Mock Concert',
      '100',
      'Tue Apr 01 2025',
    );

    expect(sendEmail).toHaveBeenCalledWith(
      ['test@example.com'],
      'Mock Concert Price Update',
      '<html>Email Body</html>',
    );
  });

  it('skips email if event not found', async () => {
    (prisma.eventInstance.findUnique as jest.Mock).mockResolvedValue(null);

    await sendwatchlistUpdateEmail();

    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('skips email if event has no price options', async () => {
    (prisma.eventInstance.findUnique as jest.Mock).mockResolvedValue({
      ...mockEvent,
      priceOptions: [],
    });

    await sendwatchlistUpdateEmail();

    expect(sendEmail).not.toHaveBeenCalled();
  });
});
