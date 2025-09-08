//  Arquivo: src/libs/jwt.ts
// Responsável por criar e verificar tokens JWT

import jwt from "jsonwebtoken";

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
export const createJWT = (payload: object) => {

    try {
        const token = jwt.sign(
            payload, 
            SECRET, 
            { 
                expiresIn: "1h", // ✅ SEGURANÇA: Reduzido de 1d para 1h
                algorithm: 'HS256', // ✅ SEGURANÇA: Algoritmo explícito
                issuer: 'api-blog-product', // ✅ SEGURANÇA: Identificar emissor
                audience: 'api-users' // ✅ SEGURANÇA: Identificar público
            }
        );

        return token;
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

        console.log('🔓 SUPER DEBUG VERIFY JWT - SUCCESS:', {
            resultType: typeof result,
            resultKeys: typeof result === 'object' && result ? Object.keys(result) : 'No keys',
            payload: result
        });

        return result;
    } catch (error) {
        console.log('🔓 SUPER DEBUG VERIFY JWT - ERROR:', {
            error: error instanceof Error ? error.message : error,
            errorName: error instanceof Error ? error.name : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace'
        });
        
        // 🔒 SEGURANÇA: Não vazar informações do erro
        throw new Error('Invalid token');
    }
};
