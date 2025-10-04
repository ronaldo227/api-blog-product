import { Request, Response, NextFunction } from 'express';

// Sanitiza corpo da requisição: remove scripts, protege contra prototype pollution e ReDoS
const DANGEROUS_PROPS = ['__proto__', 'constructor', 'prototype'];
const MAX_DEPTH = 8;
const MAX_STRING_LENGTH = 20 * 1024; // 20KB per string (ReDoS prevention)

// Regex pré-compilados
const SCRIPT_TAG_RE = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const JAVASCRIPT_URL_RE = /javascript:/gi;
const ON_ATTR_RE = /on[a-z]+\s*=\s*"[^"]*"|on[a-z]+\s*=\s*'[^']*'/gi;
const MULTI_SPACE_RE = /\s{2,}/g;

export function sanitizeValue<T>(value: T): T {
  return _sanitize(value) as T;
}

function _sanitize(value: unknown, depth = 0): unknown {
  if (depth > MAX_DEPTH) {
    return '[SANITIZED_DEPTH_EXCEEDED]';
  }

  if (typeof value === 'string') {
    // Truncar strings excessivamente longas antes de aplicar regex (prevenção ReDoS)
    let v = value.length > MAX_STRING_LENGTH ? value.slice(0, MAX_STRING_LENGTH) : value;
    v = v.replace(SCRIPT_TAG_RE, '');
    v = v.replace(JAVASCRIPT_URL_RE, '');
    v = v.replace(ON_ATTR_RE, '');
    v = v.replace(MULTI_SPACE_RE, ' ');
    v = v.trim();
    return v;
  }
  if (Array.isArray(value)) {
    return value.map(v => _sanitize(v, depth + 1));
  }
  if (value && typeof value === 'object') {
    // Preservar instâncias especiais
    if (value instanceof Date || Buffer.isBuffer(value)) return value;
    const out: Record<string, unknown> = {};
    // Usar Object.getOwnPropertyNames + hasOwnProperty para evitar prototype pollution via getters
    for (const key of Object.getOwnPropertyNames(value)) {
      if (!DANGEROUS_PROPS.includes(key) && Object.prototype.hasOwnProperty.call(value, key)) {
        out[key] = _sanitize((value as any)[key], depth + 1);
      }
    }
    return out;
  }
  return value;
}

export const sanitizeBody = (req: Request, _res: Response, next: NextFunction) => {
  if (req.body && typeof req.body === 'object') {
    try {
      // Clonar superficialmente para evitar mutação inesperada de objetos compartilhados
      const cloned = Array.isArray(req.body) ? [...req.body] : { ...req.body };
      req.body = sanitizeValue(cloned);
    } catch {
      // Em caso de erro silencioso, mantém body para não quebrar fluxo; logs podem ser adicionados se necessário
    }
  }
  next();
};
