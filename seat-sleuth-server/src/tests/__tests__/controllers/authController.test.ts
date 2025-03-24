import request from 'supertest';
import express from 'express';
import bcryptjs from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import prisma from '../../../config/db';
import authRoutes from '../../../routes/authRoutes';
import { Session, SessionData } from 'express-session';

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  req.session = {
    userId: 1,
    destroy: jest.fn((callback) => callback(null)),
  } as unknown as Session & Partial<SessionData>;
  next();
});

app.use('/auth', authRoutes);

jest.mock('../../../config/db', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('Auth Controller', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashed-password',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('POST /auth/register', () => {
    it('should create a user successfully', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcryptjs.hash as jest.Mock).mockResolvedValue('hashed-password');
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app).post('/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(StatusCodes.CREATED);
      expect(res.body.message).toBe('User created successfully');
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          password: 'hashed-password',
        },
      });
    });

    it('should return 400 if email or password is missing', async () => {
      const res = await request(app).post('/auth/register').send({
        email: 'test@example.com',
      });

      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.message).toBe('Missing email or password');
    });

    it('should return 409 if user with email already exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app).post('/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(StatusCodes.CONFLICT);
      expect(res.body.message).toBe('User with this email already exists');
    });

    it('should handle database errors gracefully', async () => {
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      const res = await request(app).post('/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body.message).toBe('An error occurred while creating the user');
    });
  });

  describe('POST /auth/login', () => {
    it('should log in user with valid credentials', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcryptjs.compare as jest.Mock).mockResolvedValue(true);

      const res = await request(app).post('/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.message).toBe('Login successful');
    });

    it('should return 400 if email or password is missing', async () => {
      const res = await request(app).post('/auth/login').send({
        email: 'test@example.com',
      });

      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.message).toBe('Missing email or password');
    });

    it('should return 401 if user does not exist', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const res = await request(app).post('/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(res.body.message).toBe('Invalid credentials');
    });

    it('should handle database errors gracefully', async () => {
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      const res = await request(app).post('/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body.message).toBe('An error occurred during login');
    });
  });

  describe('GET /auth/check', () => {
    it('should confirm if user is logged in', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcryptjs.compare as jest.Mock).mockResolvedValue(true);

      await request(app).post('/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      const res = await request(app).get('/auth/login');

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.message).toBe('User is logged in');
    });
  });

  describe('POST /auth/logout', () => {
    it('should log out user successfully', async () => {
      app.use((req, res, next) => {
        req.session.userId = 1;
        next();
      });

      const res = await request(app).post('/auth/logout');

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.message).toBe('Logout successful');
    });
  });
});
