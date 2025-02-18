import request from 'supertest';

import { server } from '../../server';

describe('Server Tests', () => {
  afterAll(async () => {
    server.close();
  });

  test('should start the server and respond to a request', async () => {
    const res = await request(server).get('/api/health');
    expect(res.status).not.toBe(404);
  });
});
