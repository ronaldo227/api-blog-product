import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';

// 🔧 CRÍTICO: Carregar variáveis de ambiente PRIMEIRO
dotenv.config();

import { env } from './src/config/env';
import { AppLogger, morganStream } from './src/utils/logger-modern';
import { 
    globalErrorHandler, 
    notFoundHandler, 
    asyncHandler 
} from './src/middlewares/error-handler';
import { 
    generalRateLimit, 
    configureTrustProxy 
} from './src/middlewares/rate-limit-modern';
import { sanitizeBody } from './src/middlewares/sanitize';
import { ensureUploadDirs, UPLOAD_ROOT } from './src/utils/uploads';
import { requestId } from './src/middlewares/request-id';

// Importar rotas
import { authRoutes } from './src/routes/auth';
import { adminRoutes } from './src/routes/admin';
import { mainRoutes } from './src/routes/main';

class APIServer {
    private app: Application;
    private port: number;

    constructor() {
        this.app = express();
        this.port = env.PORT;
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    private initializeMiddlewares(): void {
        // 🔧 Configurar proxy para rate limiting
        configureTrustProxy(this.app);

    // 🆔 Request correlation ID
    this.app.use(requestId);

        // 🗜️ PERFORMANCE: Compressão gzip
        this.app.use(compression({
            filter: (req, res) => {
                if (req.headers['x-no-compression']) {
                    return false;
                }
                return compression.filter(req, res);
            },
            level: 6,
            threshold: 1024
        }));

        // 📊 LOGGING: Morgan para HTTP requests
        if (env.NODE_ENV === 'development') {
            this.app.use(morgan('dev', { stream: morganStream }));
        } else {
            this.app.use(morgan('combined', { stream: morganStream }));
        }

        // 🛡️ SEGURANÇA: Helmet com configurações otimizadas
        this.app.use(helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'", "https:"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", "data:", "https:"],
                    connectSrc: ["'self'"],
                    fontSrc: ["'self'", "https:"],
                    objectSrc: ["'none'"],
                    mediaSrc: ["'self'"],
                    frameSrc: ["'none'"]
                },
            },
            crossOriginEmbedderPolicy: false,
            hsts: {
                maxAge: 31536000,
                includeSubDomains: true,
                preload: true
            }
        }));

        // 🔒 SEGURANÇA: CORS configurado
        this.app.use(cors({
            origin: (origin, callback) => {
                const allowedOrigins = env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
                
                // Permitir requests sem origin (mobile apps, curl, etc)
                if (!origin) return callback(null, true);
                
                if (allowedOrigins.includes(origin)) {
                    return callback(null, true);
                }
                
                AppLogger.security('CORS blocked request', { origin, allowedOrigins });
                return callback(new Error('Bloqueado pelo CORS'), false);
            },
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: [
                'Origin',
                'X-Requested-With',
                'Content-Type',
                'Accept',
                'Authorization',
                'Cache-Control',
                'X-HTTP-Method-Override'
            ],
            exposedHeaders: ['X-Total-Count', 'X-Rate-Limit-Remaining'],
            maxAge: 86400 // 24 horas
        }));

        // 🛡️ RATE LIMITING: Aplicar rate limiting geral
        this.app.use('/api', generalRateLimit);

        // 📝 PARSING: JSON com limite de tamanho
        this.app.use(express.json({ 
            limit: '10mb',
            strict: true,
            type: ['application/json', 'text/plain']
        }));
        
        this.app.use(express.urlencoded({ 
            extended: true, 
            limit: '10mb',
            parameterLimit: 20
        }));

        // 🧹 SANITIZAÇÃO: Sanitizar inputs
        this.app.use(sanitizeBody);

        // 📁 ARQUIVOS ESTÁTICOS: Servir com cache
        this.app.use('/static', express.static('public', {
            maxAge: env.NODE_ENV === 'production' ? '1d' : '0',
            etag: true,
            lastModified: true
        }));

        // 📸 Uploads públicos (capas) - somente leitura
        this.app.use('/uploads', express.static(UPLOAD_ROOT, {
            maxAge: env.NODE_ENV === 'production' ? '1d' : '0',
            immutable: env.NODE_ENV === 'production',
            etag: true
        }));

        // 🔍 MIDDLEWARE DE REQUEST LOGGING (apenas em desenvolvimento)
        if (env.NODE_ENV === 'development') {
            this.app.use((req, res, next) => {
                const startTime = Date.now();
                
                res.on('finish', () => {
                    const duration = Date.now() - startTime;
                    AppLogger.request(req, res, duration);
                });
                
                next();
            });
        }
    }

    private initializeRoutes(): void {
        // 💓 Health check
        this.app.get('/health', asyncHandler(async (req: express.Request, res: express.Response) => {
            const healthData = {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                environment: env.NODE_ENV,
                version: process.env.npm_package_version || '1.0.0',
                memory: process.memoryUsage(),
                nodeVersion: process.version
            };
            
            res.status(200).json(healthData);
        }));

        // 📡 Rotas da API
        this.app.use('/api/auth', authRoutes);
        this.app.use('/api/admin', adminRoutes);
        this.app.use('/api', mainRoutes);

        // 📋 Documentação da API (apenas em desenvolvimento)
        if (env.NODE_ENV === 'development') {
            this.app.get('/api/docs', (req, res) => {
                res.json({
                    name: 'API Blog Product',
                    version: '1.0.0',
                    description: 'API REST moderna para blog com autenticação JWT',
                    endpoints: {
                        auth: {
                            'POST /api/auth/signup': 'Criar conta',
                            'POST /api/auth/signin': 'Fazer login',
                            'POST /api/auth/validate': 'Validar token'
                        },
                        posts: {
                            'GET /api/posts': 'Listar posts',
                            'GET /api/posts/:slug': 'Obter post específico',
                            'GET /api/posts/:slug/related': 'Posts relacionados'
                        },
                        admin: {
                            'POST /api/admin/posts': 'Criar post (requer auth)'
                        },
                        utility: {
                            'GET /health': 'Status da aplicação',
                            'GET /api/ping': 'Teste de conectividade'
                        }
                    }
                });
            });
        }
    }

    private initializeErrorHandling(): void {
        // 🚫 Handler para rotas não encontradas
        this.app.use(notFoundHandler);

        // 🚨 Handler global de erros
        this.app.use(globalErrorHandler);

        // 💥 Handler para uncaught exceptions
        process.on('uncaughtException', (error: Error) => {
            AppLogger.error('Uncaught Exception:', error);
            process.exit(1);
        });

        // 💥 Handler para unhandled promise rejections
        process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
            AppLogger.error('Unhandled Rejection at:', { promise, reason });
            process.exit(1);
        });

        // 🔄 Graceful shutdown
        process.on('SIGTERM', () => {
            AppLogger.info('SIGTERM signal received. Closing HTTP server...');
            process.exit(0);
        });

        process.on('SIGINT', () => {
            AppLogger.info('SIGINT signal received. Closing HTTP server...');
            process.exit(0);
        });
    }

    public start(): void {
        this.app.listen(this.port, () => {
            AppLogger.info(`🚀 Server started successfully`, {
                port: this.port,
                environment: env.NODE_ENV,
                nodeVersion: process.version,
                timestamp: new Date().toISOString()
            });

            AppLogger.info('📡 Available endpoints:', {
                health: '/health',
                docs: env.NODE_ENV === 'development' ? '/api/docs' : 'disabled',
                api: '/api/*'
            });

            if (env.NODE_ENV === 'development') {
                AppLogger.debug('🔧 Development mode features enabled:', {
                    detailedLogging: true,
                    apiDocs: true,
                    requestLogging: true
                });
            }
        });
    }

    public getApp(): Application {
        return this.app;
    }
}

// 🚀 Inicializar servidor
const server = new APIServer();
// Garantir diretórios de upload antes de aceitar requests
ensureUploadDirs().then(() => server.start());

export default server.getApp();
