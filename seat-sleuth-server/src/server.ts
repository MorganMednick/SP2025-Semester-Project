import { Server } from 'http';
import app from './app';
import { handleGracefulShutdown } from './middleware/gracefulShutdown';
import expressListEndpoints, { Endpoint } from 'express-list-endpoints';

const PORT = process.env.PORT || 4000;

export const server: Server = app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}\n`);
  const endpoints: Endpoint[] = expressListEndpoints(app);
  console.info(`Exposing ${endpoints.length} endpoints:`);
  console.table(endpoints);
});

process.on('SIGINT', () => handleGracefulShutdown(server));
process.on('SIGTERM', () => handleGracefulShutdown(server));
