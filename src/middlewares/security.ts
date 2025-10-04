/**
 * MIT License
 * Copyright (c) 2025 Ronaldo Silva
 * See LICENSE file in the project root for full license information.
 */
import { RequestHandler } from 'express';
import { sanitizeBody } from './sanitize';
import rateLimit from 'express-rate-limit';

// 🔒 SEGURANÇA: Rate limiting para login/register
export const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // máximo 5 tentativas por IP
    message: {
        error: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
        retryAfter: 15 * 60
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true
});

// 🔒 SEGURANÇA: Headers de segurança
export const securityHeaders: RequestHandler = (req, res, next) => {
    
    // Prevenir clickjacking
    res.setHeader('X-Frame-Options', 'DENY');
    
    // Prevenir MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // XSS Protection
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Strict Transport Security (HTTPS)
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    
    // Content Security Policy
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    
    // Referrer Policy
    res.setHeader('Referrer-Policy', 'no-referrer');
    
    next();
};

// 🔒 SEGURANÇA: Validar Content-Type
export const validateContentType: RequestHandler = (req, res, next) => {
    
    if (req.method === 'POST' || req.method === 'PUT') {
        const contentType = req.headers['content-type'];
        if (!contentType || !contentType.includes('application/json')) {
            return res.status(400).json({
                error: 'Content-Type deve ser application/json'
            });
        }
    } else {
    }
    next();
};

// Sanitização agora centralizada: reutilizar sanitizeBody se necessário em pipeline
export const sanitizeInput: RequestHandler = sanitizeBody;
