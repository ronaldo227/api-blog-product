import { ExtendedRequest } from "@/types/extended-resquest";
import { RequestHandler, Response } from "express";

// Controlador para adicionar um post (exemplo de rota protegida)
export const addPost = async (req: ExtendedRequest, res: Response) => {
    // Lógica para adicionar um post
    if (!req.userId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
    }

    // ...continuação da lógica do post
}