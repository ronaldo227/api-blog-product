//  Arquivo: src/middlewares/private-route.ts
// Middleware que protege rotas privadas
// Aqui usamos a função verifyRequest do src/services/auth.ts

import { NextFunction, Request, Response } from "express";
import { verifyRequest } from "../services/auth"; // volta 1 pasta (services)

// Tipos locais
interface JWTPayload {
    id: number;
    email: string;
    name: string;
}

interface ExtendedRequest extends Request {
    user?: JWTPayload;
}

export const privateRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    console.log('🔐 SUPER DEBUG PRIVATE ROUTE - START:', {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        headers: {
            authorization: req.headers.authorization ? `Bearer ${req.headers.authorization.substring(0, 20)}...` : 'NO_AUTH_HEADER',
            contentType: req.headers['content-type'],
            userAgent: req.headers['user-agent']
        },
        body: req.body,
        params: req.params,
        query: req.query
    });

    try {
        console.log('🔐 SUPER DEBUG PRIVATE ROUTE - Calling verifyRequest...');
        const user = await verifyRequest(req); // chama verifyRequest
        
        console.log('🔐 SUPER DEBUG PRIVATE ROUTE - verifyRequest result:', {
            userFound: !!user,
            userData: user ? {
                id: user.id,
                email: user.email,
                name: user.name
            } : null
        });

        if (!user) {
            console.log('🔐 SUPER DEBUG PRIVATE ROUTE - UNAUTHORIZED: No user found');
            res.status(401).json({
                error: "Unauthorized",
                message: "Token não fornecido ou inválido"
            });
            return;
        }

        // injeta user no request com tipagem correta
        (req as ExtendedRequest).user = user as JWTPayload;
        
        console.log('🔐 SUPER DEBUG PRIVATE ROUTE - SUCCESS: User authenticated and injected to request');
        console.log('🔐 SUPER DEBUG PRIVATE ROUTE - Proceeding to next middleware/controller...');
        
        next();
    } catch (error) {
        console.log('🔐 SUPER DEBUG PRIVATE ROUTE - ERROR:', {
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : 'No stack trace',
            timestamp: new Date().toISOString()
        });
        
        res.status(401).json({
            error: "Unauthorized",
            message: "Erro na validação do token"
        });
    }
};