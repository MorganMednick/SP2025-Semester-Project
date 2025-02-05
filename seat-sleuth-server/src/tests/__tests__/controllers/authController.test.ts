jest.mock('../../../config/db', () => ({
  __esModule: true,
  default: require('../../__mocks__/prisma').default,
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedpassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

import request from 'supertest';
import app from '../../../app';
import prismaMock from '../../__mocks__/prisma';
import bcryptjs from 'bcryptjs';

describe('Auth Controller', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedpassword',
    createdAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await prismaMock.$disconnect();
  });

  it('should register a new user', async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prismaMock.user.create as jest.Mock).mockResolvedValue(mockUser);

    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('User created successfully');
  });

  it('should not allow duplicate email registration', async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('User with this email already exists');
  });

  it('should return 400 when email or password is missing', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Missing email or password');
  });

  it('should return 500 when Prisma fails during registration', async () => {
    (prismaMock.user.findUnique as jest.Mock).mockRejectedValue(new Error('Prisma error'));

    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('An error occurred while creating the user');
  });

  it('should log in a user with valid credentials', async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (bcryptjs.compare as jest.Mock).mockResolvedValue(true);

    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Login successful');
  });

  it('should return 401 when logging in with incorrect password', async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (bcryptjs.compare as jest.Mock).mockResolvedValue(false);

    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'wrongpassword',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('should return 401 when email does not exist', async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app).post('/api/auth/login').send({
      email: 'nonexistent@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('should return 400 when email or password is missing', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Missing email or password');
  });

  it('should return 500 when Prisma fails during login', async () => {
    (prismaMock.user.findUnique as jest.Mock).mockRejectedValue(new Error('Prisma error'));

    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('An error occurred during login');
  });

  it('should return 200 if the user is logged in', async () => {
    const agent = request.agent(app);

    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (bcryptjs.compare as jest.Mock).mockResolvedValue(true);

    await agent.post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    const res = await agent.get('/api/auth/login');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('User is logged in');
  });

  it('should return 401 if the user is not logged in', async () => {
    const res = await request(app).get('/api/auth/login');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('User not logged in');
  });

  it('should return 500 when Prisma fails during session check', async () => {
    const res = await request(app).get('/api/auth/login');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('User not logged in');
  });
});
