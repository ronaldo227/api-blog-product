import { z } from 'zod';
import dotenv from 'dotenv';

// 🔧 IMPORTANTE: Carregar variáveis de ambiente primeiro
dotenv.config();

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
                throw new Error('JWT_KEY deve ter pelo menos 64 caracteres em produção');
            }
            
            if (!env.DATABASE_URL.includes('ssl=true') && !env.DATABASE_URL.includes('sslmode=require')) {
                console.warn('⚠️ AVISO: DATABASE_URL deveria usar SSL em produção');
            }
        }
        
        return env;
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('❌ ERRO: Variáveis de ambiente inválidas:', error.issues);
            process.exit(1);
        }
        throw error;
    }
};

// Tipos exportados
export type ValidatedEnv = z.infer<typeof envSchema>;

// Configuração global das variáveis validadas
export const env = validateEnv();
