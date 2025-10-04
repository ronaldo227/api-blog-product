// Helper de erro HTTP padronizado: códigos estáveis + logging estruturado
import { Response } from 'express';
import { AppLogger } from './logger-modern';

export interface HttpErrorOptions {
  status: number;
  code: string;
  message: string;
  details?: any;
  logLevel?: 'warn' | 'error' | 'info';
  context?: Record<string, any>;
}

export function sendError(res: Response, opts: HttpErrorOptions) {
  const { status, code, message, details, logLevel = status >= 500 ? 'error' : 'warn', context } = opts;

  const logPayload = { code, status, message, details, ...context };
  if (logLevel === 'error') AppLogger.error('[http-error]', logPayload);
  else if (logLevel === 'warn') AppLogger.warn('[http-error]', logPayload);
  else AppLogger.info('[http-error]', logPayload);

  return res.status(status).json({ error: { code, message, details } });
}
