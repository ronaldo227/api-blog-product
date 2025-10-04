import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
// Após migração do entrypoint para src/server.ts ajustamos o import relativo
import app from '../server';
import * as healthService from '../services/health';

describe('Health Check', () => {
  it('GET /health retorna status e metadata corretos', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status');
    expect(['healthy','degraded']).toContain(res.body.status);
    expect(res.body).toHaveProperty('db');
    expect(['up','down']).toContain(res.body.db);
    expect(res.body).toHaveProperty('version');
    expect(res.body).toHaveProperty('commit');
    expect(res.body).toHaveProperty('uptime');
    expect(typeof res.body.uptime).toBe('number');
  });

  it('GET /health com DB down retorna status degraded', async () => {
    vi.spyOn(healthService, 'buildHealthPayload').mockResolvedValueOnce({
      status: 'degraded',
      uptime: 10,
      db: 'down',
      version: '1.0.0-test',
      commit: 'abc123',
      environment: 'test',
      timestamp: new Date().toISOString(),
      memory: process.memoryUsage(),
      nodeVersion: process.version
    });
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('db', 'down');
    expect(res.body).toHaveProperty('status', 'degraded');
  });
});
