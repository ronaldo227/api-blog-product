import { Router } from "express";
import { signin, signup, validate } from '../controllers/auth-modern';
import { authRateLimit } from '../middlewares/rate-limit-modern';
import { privateRoute } from '../middlewares/private-route';
import { validateSignin, validateSignup } from '../middlewares/validation';
import { AppLogger } from '../utils/logger-modern';

export const authRoutes = Router();

// 🔍 MIDDLEWARE DE LOGGING PARA ROTAS DE AUTH
authRoutes.use((req, res, next) => {
    const debugInfo = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        hasAuth: !!req.headers.authorization
    };
    
    AppLogger.debug('Auth route accessed', debugInfo);
    next();
});

// 🛡️ APLICAR RATE LIMITING PARA TODAS AS ROTAS DE AUTH
authRoutes.use(authRateLimit);

// 🔐 ROTAS DE AUTENTICAÇÃO COM VALIDAÇÃO MODERNA

// Criar conta - POST /api/auth/signin
authRoutes.post('/signin', 
    validateSignin,  // Validar dados de entrada
    signin          // Controller
);

// Fazer login - POST /api/auth/signup  
authRoutes.post('/signup', 
    validateSignup,  // Validar dados de entrada
    signup          // Controller
);

// Validar token - POST /api/auth/validate
authRoutes.post('/validate', 
    privateRoute,   // Verificar autenticação
    validate        // Controller
);

// 🔍 ROTA DE DEBUG (apenas desenvolvimento)
if (process.env.NODE_ENV === 'development') {
    authRoutes.get('/debug', (req, res) => {
        res.json({
            message: 'Auth routes debug info',
            routes: {
                'POST /signin': 'Criar nova conta',
                'POST /signup': 'Fazer login',
                'POST /validate': 'Validar token JWT'
            },
            rateLimits: {
                window: '15 minutes',
                maxAttempts: 5,
                note: 'Rate limiting aplicado a todas as rotas de auth'
            },
            validation: {
                signin: 'Nome, email e senha obrigatórios',
                signup: 'Email e senha obrigatórios',
                validate: 'Token JWT no header Authorization'
            }
        });
    });
}
