//  Arquivo: src/services/auth.ts
// Funções de autenticação (gera e valida tokens)

// Arquivo: src/services/auth.ts
// Authentication functions (generate and validate tokens)


import { User } from "@prisma/client";
import { createJWT, verifyJWT } from "../libs/jwt"; // volta 1 pasta (libs)
import { Request } from "express";

// Payload do JWT Token
interface JWTPayload {
    id: number;
    email: string;
    name: string;
}

// Criar token para um usuário
export const createToken = (user: { id: number; email: string; name: string }) => {
    console.log('🎫 SUPER DEBUG CREATE TOKEN - START:', {
        timestamp: new Date().toISOString(),
        userData: {
            id: user.id,
            email: user.email,
            name: user.name
        }
    });

    const token = createJWT({
        id: user.id,
        email: user.email,
        name: user.name
    });

    console.log('🎫 SUPER DEBUG CREATE TOKEN - SUCCESS:', {
        tokenGenerated: !!token,
        tokenLength: token?.length || 0,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'NO_TOKEN'
    });

    return token;
};

// Verificar token JWT vindo no cabeçalho da requisição
export const verifyRequest = async (req: Request): Promise<JWTPayload | false> => {
    console.log('🔍 SUPER DEBUG VERIFY REQUEST - START:', {
        timestamp: new Date().toISOString(),
        hasAuthHeader: !!req.headers.authorization,
        authHeader: req.headers.authorization ? `${req.headers.authorization.substring(0, 20)}...` : 'NO_AUTH_HEADER',
        method: req.method,
        url: req.url
    });

    const { authorization } = req.headers;

    if (!authorization) {
        console.log('🔍 SUPER DEBUG VERIFY REQUEST - NO AUTHORIZATION HEADER');
        return false;
    }

    console.log('🔍 SUPER DEBUG VERIFY REQUEST - Checking Bearer format...');
    
    // Regex seguro para validar "Bearer <token>"
    const match = authorization.match(/^Bearer\s+(.+)$/i);
    if (!match) {
        console.log('🔍 SUPER DEBUG VERIFY REQUEST - INVALID BEARER FORMAT:', {
            authHeader: authorization.substring(0, 50)
        });
        return false;
    }

    const token = match[1];
    console.log('🔍 SUPER DEBUG VERIFY REQUEST - Token extracted:', {
        tokenLength: token.length,
        tokenPreview: `${token.substring(0, 20)}...`,
        tokenEnd: `...${token.substring(token.length - 10)}`
    });

    try {
        console.log('🔍 SUPER DEBUG VERIFY REQUEST - Calling verifyJWT...');
        const payload = verifyJWT(token) as JWTPayload; // usa a função do src/libs/jwt.ts
        
        console.log('🔍 SUPER DEBUG VERIFY REQUEST - JWT VERIFIED SUCCESS:', {
            payload: {
                id: payload.id,
                email: payload.email,
                name: payload.name
            }
        });
        
        return payload;
    } catch (err) {
        console.log('🔍 SUPER DEBUG VERIFY REQUEST - JWT VERIFICATION FAILED:', {
            error: err instanceof Error ? err.message : err,
            stack: err instanceof Error ? err.stack : 'No stack trace'
        });
        return false;
    }
};
