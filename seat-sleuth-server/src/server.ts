if (process.env.NODE_ENV !== 'production') {
  console.warn(
    'Requiring dotenv in non-production environment... Ensure this is a development environment!',
  );
  require('dotenv').config();
}

import { Server } from 'http';
import app from './app';
import { handleGracefulShutdown } from './middleware/gracefulShutdown';
import expressListEndpoints, { Endpoint } from 'express-list-endpoints';

import { startScheduledTasks } from './jobs/scheduler';

const PORT = process.env.PORT || 4000;

export const server: Server = app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}\n`);

  startScheduledTasks();
  const endpoints: Endpoint[] = expressListEndpoints(app);
  console.info(`\nExposed ${endpoints.length} endpoints:`);
  console.table(endpoints);
});

process.on('SIGINT', () => handleGracefulShutdown(server));
process.on('SIGTERM', () => handleGracefulShutdown(server));
