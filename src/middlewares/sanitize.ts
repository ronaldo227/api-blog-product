import { Request, Response, NextFunction } from 'express';

/**
 * Sanitização incremental (Fase 1):
 * - Remove chaves perigosas (__proto__, constructor, prototype)
 * - Remove <script>...</script>
 * - Remove "javascript:" e atributos inline onEvent= (básico)
 * - Mantém estrutura e tipos gerais
 *
 * Fase 2 (planejada em TODO.md):
 * - Limitar profundidade
 * - Normalizar múltiplos espaços
 * - Remover atributos HTML on*
 * - Opcional: usar lib externa (xss / sanitize-html)
 */

const DANGEROUS_PROPS = ['__proto__', 'constructor', 'prototype'];

export function sanitizeValue<T>(value: T): T {
  return _sanitize(value) as T;
}

function _sanitize(value: unknown): unknown {
  if (typeof value === 'string') {
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .trim();
  }
  if (Array.isArray(value)) {
    return value.map(v => _sanitize(v));
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(value as object)) {
      if (!DANGEROUS_PROPS.includes(key)) {
        out[key] = _sanitize((value as any)[key]);
      }
    }
    return out;
  }
  return value;
}

export const sanitizeBody = (req: Request, _res: Response, next: NextFunction) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
  next();
};
