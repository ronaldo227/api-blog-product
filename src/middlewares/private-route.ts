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

    try {
        const user = await verifyRequest(req); // chama verifyRequest
        

        if (!user) {
            res.status(401).json({
                error: "Unauthorized",
                message: "Token não fornecido ou inválido"
            });
            return;
        }

        // injeta user no request com tipagem correta
        (req as ExtendedRequest).user = user as JWTPayload;
        
        
        next();
    } catch (error) {
        
        res.status(401).json({
            error: "Unauthorized",
            message: "Erro na validação do token"
        });
    }
};