//  Arquivo: src/libs/jwt.ts
// Responsável por criar e verificar tokens JWT

import jwt, { SignOptions } from "jsonwebtoken";

// 🔒 SEGURANÇA: Usar JWT_KEY do .env com fallback seguro
const SECRET = process.env.JWT_KEY || (() => {
    console.error('🚨 SECURITY WARNING: JWT_KEY not found in environment variables');
    throw new Error('JWT_KEY is required for security');
})();

// 🔒 SEGURANÇA: Validar se SECRET tem comprimento adequado
if (SECRET.length < 32) {
    throw new Error('JWT_KEY must be at least 32 characters long for security');
}

// Criar token JWT com configurações de segurança
export const createJWT = (payload: Record<string, unknown>) => {
    const rawTtl = process.env.JWT_TTL || '1h';
    // Normaliza TTL: aceita formatos como '1h','15m','3600'.
    // jwt.sign aceita string ou number; tipagem pode ser restritiva dependendo da versão @types.
    const expiresIn: any = rawTtl; 
    const options: SignOptions = {
        expiresIn,
        algorithm: 'HS256',
        issuer: 'api-blog-product',
        audience: 'api-users'
    };
    try {
        return jwt.sign(payload as object, SECRET as string, options);
    } catch (error) {
        throw error;
    }
};

// Verificar token JWT com validações de segurança
export const verifyJWT = (token: string) => {

    try {
        const result = jwt.verify(token, SECRET, {
            algorithms: ['HS256'], // ✅ SEGURANÇA: Algoritmo específico
            issuer: 'api-blog-product',
            audience: 'api-users'
        });
        return result;
    } catch (error) {
        // 🔒 SEGURANÇA: Não vazar informações do erro
        throw new Error('Invalid token');
    }
};
