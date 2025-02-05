import request from 'supertest';
import app from '../../app';
import { Server } from 'http';
import { handleGracefulShutdown } from '../../middleware/gracefulShutdown';

describe('Server Initialization', () => {
  let server: Server;

  beforeAll((done) => {
    server = app.listen(4001, () => {
      console.log('Test server running on port 4001');
      done();
    });
  });

  afterAll(async () => {
    await handleGracefulShutdown(server);
  });

  it('should start the Express app successfully', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
  });

  it('should shut down the server gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'info').mockImplementation();
    await handleGracefulShutdown(server);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Shutting down gracefully'));
    consoleSpy.mockRestore();
  });
});
