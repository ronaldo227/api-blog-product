import winston from 'winston';
import { env } from '../config/env';

// 🎯 LOGGING MODERNO: Winston com diferentes levels e formatos
const loggerFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.printf((info: any) => {
        const { timestamp, level, message, ...meta } = info;
        const metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
        return `${timestamp} [${level.toUpperCase()}]: ${message} ${metaString}`;
    })
);

// Configuração de transportes baseada no ambiente
const transports: winston.transport[] = [
    new winston.transports.Console({
        format: env.NODE_ENV === 'production' 
            ? winston.format.json() 
            : winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
    })
];

// Em produção, adicionar arquivo de log
if (env.NODE_ENV === 'production') {
    transports.push(
        new winston.transports.File({ 
            filename: 'logs/error.log', 
            level: 'error' 
        }),
        new winston.transports.File({ 
            filename: 'logs/combined.log' 
        })
    );
}

export const logger = winston.createLogger({
    level: env.LOG_LEVEL,
    format: loggerFormat,
    transports,
    exitOnError: false
});

// 🚀 PERFORMANCE: Substituir console.log por logger estruturado
export class AppLogger {
    static debug(message: string, meta?: Record<string, unknown>) {
        if (env.NODE_ENV !== 'production') {
            logger.debug(message, meta as any);
        }
    }

    static info(message: string, meta?: Record<string, unknown>) {
        logger.info(message, meta as any);
    }

    static warn(message: string, meta?: Record<string, unknown>) {
        logger.warn(message, meta as any);
    }

    static error(message: string, error?: Error | Record<string, unknown>) {
        logger.error(message, error as any);
    }

    static request(req: any, res: any, responseTime?: number) {
        const logData = {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            userAgent: req.get('user-agent'),
            ip: req.ip,
            responseTime: responseTime ? `${responseTime}ms` : undefined
        };

        if (env.NODE_ENV === 'development') {
            logger.info(`${req.method} ${req.url} - ${res.statusCode}`, logData);
        } else {
            // Em produção, log apenas erros e informações críticas
            if (res.statusCode >= 400) {
                logger.warn(`Request failed: ${req.method} ${req.url}`, logData);
            }
        }
    }

    static auth(message: string, meta?: Record<string, unknown>) {
        // Logs de autenticação sempre importantes
        logger.info(`[AUTH] ${message}`, {
            ...meta,
            timestamp: new Date().toISOString()
        });
    }

    static security(message: string, meta?: Record<string, unknown>) {
        // Logs de segurança sempre críticos
        logger.warn(`[SECURITY] ${message}`, {
            ...meta,
            timestamp: new Date().toISOString()
        });
    }
}

// Stream para Morgan (middleware de log HTTP)
export const morganStream = {
    write: (message: string) => {
        logger.info(message.trim());
    }
};
