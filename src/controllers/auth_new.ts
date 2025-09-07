import { RequestHandler } from "express";
import { z } from 'zod';

// Schema para refresh token
const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, "Refresh token é obrigatório")
});

export const refreshToken: RequestHandler = async (req, res) => {
    // 🔍 DEBUG: Variáveis para watch
    const requestBody = req.body;
    const requestMethod = req.method;
    const requestPath = req.path;
    const headers = req.headers;

    console.log('🔧 DEBUG refreshToken - Start:', {
        requestBody,
        requestMethod,
        requestPath,
        contentType: headers['content-type'],
        authorization: headers.authorization ? 'Token presente' : 'Sem token'
    });

    const data = refreshTokenSchema.safeParse(req.body);

    if (!data.success) {
        const validationErrors = data.error.flatten().fieldErrors;
        console.log('🚨 DEBUG refreshToken - Validation Error:', validationErrors);
        res.json({ error: validationErrors });
        return;
    }

    // Lógica para refresh token (implementar depois)
    const response = {
        message: 'Refresh token functionality - em desenvolvimento',
        newToken: 'novo_token_aqui'
    };

    console.log('✅ DEBUG refreshToken - Response ready:', response);

    res.json(response);
};

export const logout: RequestHandler = async (req, res) => {
    // 🔍 DEBUG: Variáveis para watch
    const requestMethod = req.method;
    const requestPath = req.path;
    const headers = req.headers;

    console.log('🔧 DEBUG logout - Start:', {
        requestMethod,
        requestPath,
        authorization: headers.authorization ? 'Token presente' : 'Sem token'
    });

    // Lógica para logout (implementar depois)
    const response = { message: 'Logout realizado com sucesso' };

    console.log('✅ DEBUG logout - Response ready:', response);

    res.json(response);
};
