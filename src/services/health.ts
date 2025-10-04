// Health check: verifica DB com timeout, retorna 'healthy' ou 'degraded'
import { prisma } from '@/libs/prisma';
import { env } from '@/config/env';

export async function checkDatabase(timeoutMs: number = 1500): Promise<'up' | 'down'> {
  const timeout = new Promise<'down'>(resolve => setTimeout(() => resolve('down'), timeoutMs));
  try {
    const result = await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      timeout
    ]);
    // Se o race retornou 'down' é porque caiu no timeout
    if (result === 'down') return 'down';
    return 'up';
  } catch (_e) {
    return 'down';
  }
}

export interface HealthPayload {
  status: 'healthy' | 'degraded';
  uptime: number;
  db: 'up' | 'down';
  version: string;
  commit: string;
  environment: string;
  timestamp: string;
  memory: NodeJS.MemoryUsage;
  nodeVersion: string;
}

export async function buildHealthPayload(): Promise<HealthPayload> {
  const db = await checkDatabase();
  const status: HealthPayload['status'] = db === 'up' ? 'healthy' : 'degraded';
  return {
    status,
    uptime: process.uptime(),
    db,
    version: process.env.npm_package_version || '0.0.0',
    commit: process.env.GIT_COMMIT || process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    nodeVersion: process.version
  };
}
