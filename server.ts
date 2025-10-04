/**
 * LEGACY SERVER FILE (server-legacy.ts)
 * Mantido apenas para estudo/comparação.
 * O servidor oficial de produção agora é `server-modern.ts`.
 * Não adicionar novas funcionalidades aqui.
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { securityHeaders, validateContentType, sanitizeInput } from './src/middlewares/security';

// Configurar variáveis de ambiente
dotenv.config();

import { mainRoutes } from './src/routes/main';
import { adminRoutes } from './src/routes/admin';
import { authRoutes } from './src/routes/auth';

const server = express();

// 🔒 SEGURANÇA: Helmet para headers básicos
server.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));

// 🔒 SEGURANÇA: Headers customizados
server.use(securityHeaders);

// 🔒 SEGURANÇA: CORS configurado
server.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 🔒 SEGURANÇA: Limite de tamanho do body (Express embutido)
server.use(express.json({ limit: '10mb' }));
server.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 🔒 SEGURANÇA: Validar Content-Type
server.use(validateContentType);

// 🔒 SEGURANÇA: Sanitizar inputs
server.use(sanitizeInput);

// Middleware de debug
server.use((req, res, next) => {
    console.log('🌟 SUPER DEBUG SERVER - Request incoming:', {
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        url: req.url,
        headers: req.headers,
        body: req.body,
        query: req.query,
        params: req.params,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    next();
});

// ✅ SEGURANÇA: Arquivos estáticos
server.use(express.static('public'));

// Route handling
server.use('/api/auth', authRoutes);
server.use('/api/admin', adminRoutes);
server.use('/api', mainRoutes);

server.listen(4444, () => {
    console.log('🚀 SUPER DEBUG SERVER - Server is running on port 4444');
    console.log('🔧 SUPER DEBUG SERVER - Debug mode: SUPER ACTIVE');
    console.log('🌍 SUPER DEBUG SERVER - Environment:', process.env.NODE_ENV || 'development');
    console.log('🔐 SUPER DEBUG SERVER - Database URL configured:', !!process.env.DATABASE_URL);
    console.log('🔐 SUPER DEBUG SERVER - JWT Secret configured:', !!process.env.JWT_KEY);
    console.log('🛡️ SUPER DEBUG SERVER - Security headers active');
    console.log('📡 SUPER DEBUG SERVER - Endpoints disponíveis:');
    console.log('  - GET  /api/ping');
    console.log('  - POST /api/auth/signin');
    console.log('  - POST /api/auth/signup');
    console.log('  - POST /api/auth/validate');
    console.log('🎯 SUPER DEBUG SERVER - Server startup complete at:', new Date().toISOString());
});
