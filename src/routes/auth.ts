import { Router } from "express";
import { signin, signup } from '../controllers/auth';
import { authRateLimit } from '../middlewares/security';
import { privateRoute } from '../middlewares/private-route';
import * as authController from '../controllers/auth';

export const authRoutes = Router();

// � SUPER DEBUG: Middleware para debug profundo
authRoutes.use((req, res, next) => {
    const debugInfo = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        originalUrl: req.originalUrl,
        baseUrl: req.baseUrl,
        path: req.path,
        params: req.params,
        query: req.query,
        body: req.body,
        headers: {
            authorization: req.headers.authorization ? '***TOKEN_PRESENTE***' : 'SEM_TOKEN',
            contentType: req.headers['content-type'],
            userAgent: req.headers['user-agent'],
            accept: req.headers.accept,
            origin: req.headers.origin,
            referer: req.headers.referer,
            xForwardedFor: req.headers['x-forwarded-for'],
            xRealIp: req.headers['x-real-ip']
        },
        ip: req.ip,
        ips: req.ips,
        protocol: req.protocol,
        secure: req.secure,
        fresh: req.fresh,
        stale: req.stale,
        xhr: req.xhr,
        route: req.route?.path || 'NO_ROUTE'
    };
    
    console.log('🔥 SUPER DEBUG AUTH ROUTES - Request Details:', JSON.stringify(debugInfo, null, 2));
    
    // Debug da resposta
    const originalSend = res.send;
    res.send = function(data) {
        console.log('🔥 SUPER DEBUG AUTH ROUTES - Response:', {
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            headers: res.getHeaders(),
            data: typeof data === 'string' ? JSON.parse(data || '{}') : data
        });
        return originalSend.call(this, data);
    };
    
    next();
});

// �🔒 SEGURANÇA: Rate limiting para rotas de auth
authRoutes.use(authRateLimit);

//Routes de autenticação
authRoutes.post('/signup', signup);
authRoutes.post('/signin', signin);
authRoutes.post('/validate', privateRoute, authController.validate);
