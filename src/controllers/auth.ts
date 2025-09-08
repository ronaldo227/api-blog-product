/**
 * ATENÇÃO: Este arquivo contém logs temporários para depuração.
 * Quando terminar de depurar, remova todos os console.log de debug para manter o código limpo e profissional.
 */
import { RequestHandler, Response } from "express";
import { z } from 'zod';
import { createUser, verifyUser } from "../services/user";
import { createToken } from "../services/auth";
import { ExtendedRequest } from "@/types/extended-resquest";

const signinSchema = z.object({
    name: z.string()
        .min(2, "Nome deve ter pelo menos 2 caracteres")
        .max(50, "Nome muito longo")
        .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),
    email: z.string()
        .email("Email inválido")
        .toLowerCase()
        .max(100, "Email muito longo"),
    password: z.string()
        .min(8, "Senha deve ter pelo menos 8 caracteres")
        .max(128, "Senha muito longa")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            "Senha deve conter: maiúscula, minúscula, número e símbolo")
});

const signupSchema = z.object({
    email: z.string()
        .email("Email inválido")
        .toLowerCase()
        .max(100, "Email muito longo"),
    password: z.string()
        .min(8, "Senha deve ter pelo menos 8 caracteres")
        .max(128, "Senha muito longa")
});

// Controlador para registrar um novo usuário
export const signin: RequestHandler = async (req, res) => {
    console.log('[DEBUG signin] Request body:', req.body);
    const data = signinSchema.safeParse(req.body);

    if (!data.success) {
        console.log('[DEBUG signin] Validation error:', data.error.flatten().fieldErrors);
        return res.status(401).json({ error: 'Acesso negado', details: data.error.flatten().fieldErrors });
    }

    const validatedData = data.data;
    console.log('[DEBUG signin] Validated data:', validatedData);
    const user = await createUser(validatedData);
    console.log('[DEBUG signin] User criado:', user);

    if (!user) {
        return res.status(401).json({ error: 'Acesso negado' });
    }

    const token = createToken(user);
    console.log('[DEBUG signin] Token gerado:', token);

    const response = {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            status: user.status
        },
        token
    };


    res.status(201).json(response);
};

// Controlador para fazer login
export const signup: RequestHandler = async (req, res) => {
    console.log('[DEBUG signup] Request body:', req.body);
    const data = signupSchema.safeParse(req.body);

    if (!data.success) {
        console.log('[DEBUG signup] Validation error:', data.error.flatten().fieldErrors);
        return res.status(401).json({ error: 'Acesso negado', details: data.error.flatten().fieldErrors });
    }

    const validatedData = data.data;
    console.log('[DEBUG signup] Validated data:', validatedData);
    const user = await verifyUser({ email: validatedData.email, password: validatedData.password });
    console.log('[DEBUG signup] User verificado:', user);

    if (!user) {
        return res.status(401).json({ error: 'Acesso negado' });
    }

    const token = createToken(user);
    console.log('[DEBUG signup] Token gerado:', token);

    const response = {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            status: user.status
        },
        token
    };


    res.json(response);
};

// Controlador para validar token
export const validate = (req: ExtendedRequest, res: Response) => {
    console.log('[DEBUG validate] req.userId:', req.userId);
    if (!req.userId) {
        return res.status(401).json({ error: 'Acesso negado' });
    }
    console.log('[DEBUG validate] Usuário autenticado:', {
        id: req.userId.id,
        name: req.userId.name,
        email: req.userId.email
    });
    res.json({
        valid: true,
        user: {
            id: req.userId.id,
            name: req.userId.name,
            email: req.userId.email
        }
    });
};
