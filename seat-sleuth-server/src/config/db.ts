import { PrismaClient } from '@prisma/client';

import { DATABASE_URL } from './env';

const prisma = new PrismaClient();

async function connectToDatabase() {
  try {
    await prisma.$connect();
    console.log(`Prisma client synched with ${DATABASE_URL}`);
  } catch (err) {
    console.error('Failed to connect to the DB:', err);
    process.exit(1);
  }
}

connectToDatabase();

export default prisma;
