import { RequestHandler } from 'express';
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
    console.log('🛡️ SUPER DEBUG SECURITY - Applying security headers:', {
        method: req.method,
        path: req.path,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    
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
    
    console.log('🛡️ SUPER DEBUG SECURITY - Security headers applied successfully');
    
    next();
};

// 🔒 SEGURANÇA: Validar Content-Type
export const validateContentType: RequestHandler = (req, res, next) => {
    console.log('🔍 SUPER DEBUG SECURITY - Validating content type:', {
        method: req.method,
        contentType: req.headers['content-type'],
        path: req.path
    });
    
    if (req.method === 'POST' || req.method === 'PUT') {
        const contentType = req.headers['content-type'];
        if (!contentType || !contentType.includes('application/json')) {
            console.log('🔍 SUPER DEBUG SECURITY - CONTENT TYPE VALIDATION FAILED:', {
                provided: contentType,
                required: 'application/json'
            });
            return res.status(400).json({
                error: 'Content-Type deve ser application/json'
            });
        }
        console.log('🔍 SUPER DEBUG SECURITY - Content type validation passed');
    } else {
        console.log('🔍 SUPER DEBUG SECURITY - Content type validation skipped (GET request)');
    }
    next();
};

// 🔒 SEGURANÇA: Sanitizar input
export const sanitizeInput: RequestHandler = (req, res, next) => {
    console.log('🧹 SUPER DEBUG SECURITY - Starting input sanitization:', {
        hasBody: !!req.body,
        bodyKeys: req.body ? Object.keys(req.body) : [],
        path: req.path
    });
    
    if (req.body) {
        // Remove propriedades perigosas
        const dangerousProps = ['__proto__', 'constructor', 'prototype'];
        
        console.log('🧹 SUPER DEBUG SECURITY - Original body:', req.body);
        
        const sanitize = (obj: any): any => {
            if (typeof obj !== 'object' || obj === null) return obj;
            
            const sanitized: any = {};
            for (const key in obj) {
                if (!dangerousProps.includes(key)) {
                    if (typeof obj[key] === 'string') {
                        // Remover caracteres perigosos
                        const original = obj[key];
                        sanitized[key] = obj[key]
                            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                            .trim();
                        
                        if (original !== sanitized[key]) {
                            console.log('🧹 SUPER DEBUG SECURITY - String sanitized:', {
                                key,
                                original,
                                sanitized: sanitized[key]
                            });
                        }
                    } else {
                        sanitized[key] = sanitize(obj[key]);
                    }
                } else {
                    console.log('🧹 SUPER DEBUG SECURITY - Dangerous property removed:', key);
                }
            }
            return sanitized;
        };
        
        req.body = sanitize(req.body);
        console.log('🧹 SUPER DEBUG SECURITY - Sanitized body:', req.body);
    } else {
        console.log('🧹 SUPER DEBUG SECURITY - No body to sanitize');
    }
    
    console.log('🧹 SUPER DEBUG SECURITY - Input sanitization completed');
    next();
};
