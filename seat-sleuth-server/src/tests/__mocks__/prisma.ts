import { PrismaClient } from '@prisma/client';

const prismaMock = {
  user: {
    findUnique: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue(null),
  },
  $disconnect: jest.fn(),
} as unknown as PrismaClient;

export default prismaMock;
