import { Server } from 'http';
import prisma from '../config/db';
import { stopScheduledTasks } from '../jobs/scheduler';

export const handleGracefulShutdown = async (server: Server): Promise<void> => {
  console.info('\nShutting down gracefully...');
  try {
    stopScheduledTasks();
    await prisma.$disconnect();
    console.info('Prisma sequence closed for psql...');

    server.close(() => {
      console.info('Server routes disabled...\nServer is offline :)');
    });
  } catch (err) {
    console.error('Error during shutdown:', err);
  }
};
