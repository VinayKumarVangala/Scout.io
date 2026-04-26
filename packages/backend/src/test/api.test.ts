import request from 'supertest';
import { createServer } from '../server';

const { app } = createServer();

describe('API Health Checks', () => {
  it('GET /health should return 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  it('GET /api/non-existent should return 404', async () => {
    const res = await request(app).get('/api/non-existent');
    expect(res.status).toBe(404);
  });
});
