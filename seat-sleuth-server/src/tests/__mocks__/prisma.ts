import { PrismaClient } from '@prisma/client';

const prismaMock = {
  user: {
    findUnique: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue(null),
  },
  event: {
    upsert: jest.fn(),
  },
  userWatchlist: {
    upsert: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
  watchedPrice: {
    findFirst: jest.fn(),
    create: jest.fn(),
    deleteMany: jest.fn(),
  },
  $disconnect: jest.fn(),
} as unknown as PrismaClient;

export default prismaMock;
