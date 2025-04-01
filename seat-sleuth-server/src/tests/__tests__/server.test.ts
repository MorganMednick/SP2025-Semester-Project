import request from 'supertest';
import { server } from '../../server';
import { stopScheduledTasks } from '../../jobs/scheduler';

describe('Server Tests', () => {
  afterAll(async () => {
    stopScheduledTasks();
    server.close();
  });

  test('should start the server and respond to a request', async () => {
    const res = await request(server).get('/api/health');
    expect(res.status).not.toBe(404);
  });
});
