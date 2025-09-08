/**
 * Middleware privateRoute:
 * - Injeta usuário autenticado em req.userId.
 * - Retorna 401 se token JWT for inválido ou ausente.
 * - Atenção: mantenha o JWT_KEY seguro e use HTTPS.
 */
/**
 * Middleware privateRoute atualizado:
 * - Injeta o usuário autenticado em req.userId (compatível com ExtendedRequest e controllers/auth).
 * - Garante que rotas protegidas só funcionam com token JWT válido.
 * - Para evitar erro 'Content-Type deve ser application/json', sempre envie o header correto nas requisições.
 */
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

        // injeta user no request com tipagem correta (compatível com ExtendedRequest)
        (req as any).userId = user as JWTPayload;


        next();
    } catch (error) {

        res.status(401).json({
            error: "Unauthorized",
            message: "Erro na validação do token"
        });
    }
};