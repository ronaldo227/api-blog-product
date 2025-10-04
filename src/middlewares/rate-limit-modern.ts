/**
 * Sistema de Rate Limiting Multi-Camadas
 * 
 * Estratégias implementadas:
 * - Rate limiting geral: Proteção DDoS básica
 * - Rate limiting de autenticação: Anti-brute force
 * - Rate limiting de recursos: Proteção de endpoints críticos
 * - Configuração dinâmica por endpoint
 */
import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { AppLogger } from '../utils/logger-modern';
import { env } from '../config/env';
import { RateLimitError } from './error-handler';

/** Rate limiting geral - Primeira linha de defesa contra DDoS */
export const generalRateLimit = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS, // 15 minutos
    max: env.RATE_LIMIT_MAX_REQUESTS * 10, // 50 requests por IP
    message: {
        success: false,
        error: {
            message: 'Muitas requisições. Tente novamente em 15 minutos.',
            code: 'RATE_LIMIT_EXCEEDED',
            retryAfter: env.RATE_LIMIT_WINDOW_MS / 1000
        }
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
        AppLogger.security('Rate limit exceeded', {
            ip: req.ip,
            userAgent: req.get('user-agent'),
            url: req.url,
            method: req.method
        });
        
        throw new RateLimitError('Limite de requisições excedido');
    }
});

// Rate limiting específico para autenticação (mais restritivo)
export const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // 5 tentativas de login por IP
    message: {
        success: false,
        error: {
            message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
            code: 'AUTH_RATE_LIMIT_EXCEEDED',
            retryAfter: 900
        }
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Pular rate limit para tokens válidos no validate
        return !!(req.url.includes('/validate') && req.headers.authorization);
    },
    handler: (req: Request, res: Response) => {
        AppLogger.security('Auth rate limit exceeded', {
            ip: req.ip,
            userAgent: req.get('user-agent'),
            url: req.url,
            method: req.method,
            body: { email: req.body?.email } // Log apenas email, não senha
        });
        
        throw new RateLimitError('Muitas tentativas de autenticação. Aguarde 15 minutos.');
    }
});

// Rate limiting para criação de recursos (mais restritivo)
export const createResourceRateLimit = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 3, // 3 criações por minuto
    message: {
        success: false,
        error: {
            message: 'Limite de criação de recursos excedido. Aguarde 1 minuto.',
            code: 'CREATE_RATE_LIMIT_EXCEEDED',
            retryAfter: 60
        }
    },
    handler: (req: Request, res: Response) => {
        AppLogger.security('Create resource rate limit exceeded', {
            ip: req.ip,
            userAgent: req.get('user-agent'),
            url: req.url,
            method: req.method
        });
        
        throw new RateLimitError('Limite de criação excedido');
    }
});

// Rate limiting por endpoint específico
export const endpointRateLimit = (maxRequests: number, windowMinutes: number = 15) => {
    return rateLimit({
        windowMs: windowMinutes * 60 * 1000,
        max: maxRequests,
        message: {
            success: false,
            error: {
                message: `Limite de ${maxRequests} requisições por ${windowMinutes} minutos excedido.`,
                code: 'ENDPOINT_RATE_LIMIT_EXCEEDED',
                retryAfter: windowMinutes * 60
            }
        },
        handler: (req: Request, res: Response) => {
            AppLogger.security('Endpoint rate limit exceeded', {
                ip: req.ip,
                userAgent: req.get('user-agent'),
                url: req.url,
                method: req.method,
                limit: maxRequests,
                windowMinutes
            });
            
            throw new RateLimitError(`Limite do endpoint excedido`);
        }
    });
};

// 🔧 CONFIGURAÇÃO DE TRUST PROXY
export const configureTrustProxy = (app: any) => {
    // Para produção com proxy reverso (nginx, cloudflare, etc.)
    if (env.NODE_ENV === 'production') {
        app.set('trust proxy', 1);
        AppLogger.info('Trust proxy configured for production');
    } else {
        // Para desenvolvimento local
        app.set('trust proxy', false);
    }
};
