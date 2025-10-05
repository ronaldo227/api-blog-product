import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { httpLogger } from './utils/http-logger';
import dotenv from 'dotenv';

// Configuração prioritária de ambiente antes dos imports
dotenv.config();

import { env } from './config/env';
import { AppLogger } from './utils/logger-modern';
import { 
    globalErrorHandler, 
    notFoundHandler, 
    asyncHandler 
} from './middlewares/error-handler';
import { 
    generalRateLimit, 
    configureTrustProxy 
} from './middlewares/rate-limit-modern';
import { sanitizeBody } from './middlewares/sanitize';
import { ensureUploadDirs, UPLOAD_ROOT } from './utils/uploads';
import { requestId } from './middlewares/request-id';

// Rotas modulares organizadas por domínio
import { authRoutes } from './routes/auth';
import { adminRoutes } from './routes/admin';
import { mainRoutes } from './routes/main';
import { buildHealthPayload } from '@/services/health';

/**
 * Servidor API enterprise-level com arquitetura em camadas
 * 
 * Pipeline de Requisição (Ordem de Execução):
 * Trust Proxy → Request ID → Compression → HTTP Logger → Helmet → 
 * CORS → Rate Limiting → JSON Parser → URL Parser → Sanitização → 
 * Static Files → Routes → Controllers → Services → Database → Error Handler
 * 
 * Cada middleware tem responsabilidade específica na cadeia de processamento,
 * garantindo segurança, performance e observabilidade enterprise.
 */
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
        configureTrustProxy(this.app);
        this.app.use(requestId);

        this.app.use(compression({
            filter: (req, res) => {
                if (req.headers['x-no-compression']) return false;
                return compression.filter(req, res);
            },
            level: 6,
            threshold: 1024
        }));

        // HTTP logging próprio (substitui Morgan)
        this.app.use(httpLogger);

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
            hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }
        }));

        this.app.use(cors({
            origin: (origin, callback) => {
                const allowedOrigins = env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
                if (!origin) return callback(null, true);
                if (allowedOrigins.includes(origin)) return callback(null, true);
                AppLogger.security('CORS blocked request', { origin, allowedOrigins });
                return callback(new Error('Bloqueado pelo CORS'), false);
            },
            credentials: true,
            methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
            allowedHeaders: [
                'Origin','X-Requested-With','Content-Type','Accept','Authorization','Cache-Control','X-HTTP-Method-Override'
            ],
            exposedHeaders: ['X-Total-Count','X-Rate-Limit-Remaining'],
            maxAge: 86400
        }));

        this.app.use('/api', generalRateLimit);

        this.app.use(express.json({ limit: '10mb', strict: true, type: ['application/json','text/plain'] }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb', parameterLimit: 20 }));

        this.app.use(sanitizeBody);

        this.app.use('/static', express.static('public', {
            maxAge: env.NODE_ENV === 'production' ? '1d' : '0',
            etag: true,
            lastModified: true
        }));

        this.app.use('/uploads', express.static(UPLOAD_ROOT, {
            maxAge: env.NODE_ENV === 'production' ? '1d' : '0',
            immutable: env.NODE_ENV === 'production',
            etag: true
        }));

        if (env.NODE_ENV === 'development') {
            this.app.use((req, res, next) => {
                const start = Date.now();
                res.on('finish', () => {
                    const duration = Date.now() - start;
                    AppLogger.request(req, res, duration);
                });
                next();
            });
        }
    }

    private initializeRoutes(): void {
    this.app.get('/health', asyncHandler(async (_req: express.Request, res: express.Response) => {
            const payload = await buildHealthPayload();
            res.status(200).json(payload);
        }));

        this.app.use('/api/auth', authRoutes);
        this.app.use('/api/admin', adminRoutes);
        this.app.use('/api', mainRoutes);

        if (env.NODE_ENV === 'development') {
            this.app.get('/api/docs', (_req, res) => {
                res.json({ name: 'API Blog Product', version: '1.0.0' });
            });
        }
    }

    private initializeErrorHandling(): void {
        this.app.use(notFoundHandler);
        this.app.use(globalErrorHandler);

        process.on('uncaughtException', (error: Error) => {
            AppLogger.error('Uncaught Exception:', error);
            process.exit(1);
        });
        process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
            AppLogger.error('Unhandled Rejection at:', { promise, reason });
            process.exit(1);
        });
        process.on('SIGTERM', () => { AppLogger.info('SIGTERM received'); process.exit(0); });
        process.on('SIGINT', () => { AppLogger.info('SIGINT received'); process.exit(0); });
    }

    public start(): void {
        this.app.listen(this.port, () => {
            AppLogger.info('🚀 Server started successfully', {
                port: this.port,
                environment: env.NODE_ENV,
                nodeVersion: process.version,
                timestamp: new Date().toISOString()
            });
        });
    }

    public getApp(): Application { return this.app; }
}

const server = new APIServer();

// Em ambiente de teste não iniciamos o listener para evitar portas ocupadas e race conditions nos testes.
if (env.NODE_ENV !== 'test') {
    ensureUploadDirs().then(() => server.start());
}

// Exporta app para Supertest e função opcional para iniciar manualmente (caso algum cenário de integração precise)
export const startServer = async () => {
    await ensureUploadDirs();
    server.start();
    return server.getApp();
};

export default server.getApp();
