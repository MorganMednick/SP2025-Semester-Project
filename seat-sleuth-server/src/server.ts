import { Server } from 'http';
import app from './app';
import { handleGracefulShutdown } from './middleware';

const PORT = process.env.PORT || 4000;

const server: Server = app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});

process.on('SIGINT', () => handleGracefulShutdown(server));
process.on('SIGTERM', () => handleGracefulShutdown(server));
