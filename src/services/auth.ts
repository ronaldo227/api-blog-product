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

    const token = createJWT({
        id: user.id,
        email: user.email,
        name: user.name
    });

    return token;
};

// Verificar token JWT vindo no cabeçalho da requisição
export const verifyRequest = async (req: Request): Promise<JWTPayload | false> => {

    const { authorization } = req.headers;

    if (!authorization) {
        return false;
    }

    // Regex seguro para validar "Bearer <token>"
    const match = authorization.match(/^Bearer\s+(.+)$/i);
    if (!match) {
        return false;
    }

    const token = match[1];
    if (!token || typeof token !== 'string') {
        return false;
    }

    try {
    const payload = verifyJWT(token) as JWTPayload; // usa a função do src/libs/jwt.ts
        
        return payload;
    } catch (err) {
        return false;
    }
};
