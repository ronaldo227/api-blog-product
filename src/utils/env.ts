import { z } from 'zod';

// 🔒 SEGURANÇA: Schema para validar variáveis de ambiente
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().transform(Number).default(4444),
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    JWT_KEY: z.string().min(32, 'JWT_KEY must be at least 32 characters long'),
    ALLOWED_ORIGINS: z.string().optional(),
    RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default(900000),
    RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default(5),
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info')
});

export const validateEnv = () => {
    try {
        const env = envSchema.parse(process.env);
        
        // 🔒 SEGURANÇA: Validações adicionais
        if (env.NODE_ENV === 'production') {
            if (env.JWT_KEY.length < 64) {
                throw new Error('JWT_KEY should be at least 64 characters in production');
            }
            if (!env.ALLOWED_ORIGINS) {
                throw new Error('ALLOWED_ORIGINS must be set in production');
            }
        }
        
        return env;
    } catch (error) {
        console.error('❌ Environment validation failed:', error);
        process.exit(1);
    }
};

export type Env = ReturnType<typeof validateEnv>;
