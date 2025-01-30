import { Server } from 'http';
import prisma from '../config/db';

export const handleGracefulShutdown = async (server: Server): Promise<void> => {
  console.info('\nShutting down gracefully...');
  try {
    await prisma.$disconnect();
    console.info('Prisma sequence closed for psql...');

    server.close(() => {
      console.info('Server routes disabled...\nServer is offline :)');
      process.exit(0);
    });
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
};
