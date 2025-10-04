import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server-modern';

describe('Health Check', () => {
  it('GET /health retorna status 200 e JSON esperado', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'healthy');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('environment');
  });
});
