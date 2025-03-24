import request from 'supertest';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import prisma from '../../../config/db';
import watchlistRoutes from '../../../routes/watchlistRoutes';

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  req.session = {
    userId: 1,
  } as any;
  next();
});

app.use('/watchlist', watchlistRoutes);

jest.mock('../../../config/db', () => ({
  user: {
    findUnique: jest.fn(),
  },
  eventInstance: {
    findUnique: jest.fn(),
  },
  watchedEvent: {
    upsert: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('Watchlist Controller', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    watchlist: [],
  };

  const mockEventInstance = {
    ticketMasterId: 'event-123',
    eventName: 'Test Event',
    venueName: 'Test Venue',
    city: 'Test City',
    country: 'Test Country',
    priceOptions: [],
    watchers: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be ok to proceed with testing lol', async () => {
    expect(1).toBe(1);
  });

  describe('GET /watchlist', () => {
    it('should fetch the user watchlist successfully', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        ...mockUser,
        watchlist: [
          {
            eventInstance: {
              ...mockEventInstance,
              event: {
                eventName: 'Test Event',
                genre: 'Comedy',
                coverImage: 'https://placeholder.com',
                instanceCount: 1,
              },
            },
          },
        ],
      });

      const res = await request(app).get('/watchlist');

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.data[0].eventName).toBe('Test Event');
    });

    it('should return 404 if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get('/watchlist');

      expect(res.status).toBe(StatusCodes.NOT_FOUND);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('User not found');
    });

    it('should handle database errors gracefully', async () => {
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/watchlist');

      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Error fetching user watchlist.');
    });
  });

  describe('POST /watchlist', () => {
    it('should add an event to the watchlist', async () => {
      (prisma.eventInstance.findUnique as jest.Mock).mockResolvedValue(mockEventInstance);
      (prisma.watchedEvent.upsert as jest.Mock).mockResolvedValue({});

      const res = await request(app).post('/watchlist').send({ eventInstanceId: 'event-123' });

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.message).toBe('Event option added to watchlist');
    });

    it('should return 400 if event option ID is missing', async () => {
      const res = await request(app).post('/watchlist').send({});

      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.message).toBe('Event Option ID is required');
    });

    it('should return 404 if event option does not exist', async () => {
      (prisma.eventInstance.findUnique as jest.Mock).mockResolvedValue(null);

      const res = await request(app).post('/watchlist').send({ eventInstanceId: 'event-123' });

      expect(res.status).toBe(StatusCodes.NOT_FOUND);
      expect(res.body.message).toBe('Event Option not found');
    });

    it('should handle database errors gracefully', async () => {
      (prisma.eventInstance.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      const res = await request(app).post('/watchlist').send({ eventInstanceId: 'event-123' });

      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /watchlist', () => {
    it('should remove an event from the watchlist', async () => {
      (prisma.watchedEvent.findUnique as jest.Mock).mockResolvedValue({});
      (prisma.watchedEvent.delete as jest.Mock).mockResolvedValue({});

      const res = await request(app).delete('/watchlist').send({ eventInstanceId: 'event-123' });

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.message).toBe('Event option removed from watchlist');
    });

    it('should return 404 if entry does not exist', async () => {
      (prisma.watchedEvent.findUnique as jest.Mock).mockResolvedValue(null);

      const res = await request(app).delete('/watchlist').send({ eventInstanceId: 'event-123' });

      expect(res.status).toBe(StatusCodes.NOT_FOUND);
      expect(res.body.message).toBe('Watchlist entry not found');
    });

    it('should handle database errors gracefully', async () => {
      (prisma.watchedEvent.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      const res = await request(app).delete('/watchlist').send({ eventInstanceId: 'event-123' });

      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body.success).toBe(false);
    });
  });
});
