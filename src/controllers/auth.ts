import { RequestHandler } from "express";
import { z } from 'zod';
import { createUser, verifyUser } from "../services/user";
import { createToken } from "../services/auth";

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
    const data = signinSchema.safeParse(req.body);

    if (!data.success) {
    res.json({ error: data.error.flatten().fieldErrors });
        return;
    }

    const validatedData = data.data;
    const user = await createUser(validatedData);
    
    if (!user) {
        res.json({ error: 'erro ao criar usuario' });
        return;
    }

    const token = createToken(user);
    
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
    const data = signupSchema.safeParse(req.body);

    if (!data.success) {
    res.json({ error: data.error.flatten().fieldErrors });
        return;
    }

    const validatedData = data.data;
    const user = await verifyUser({ email: validatedData.email, password: validatedData.password });
    
    if (!user) {
        res.json({ error: 'credenciais inválidas' });
        return;
    }

    const token = createToken(user);
    
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
export const validate: RequestHandler = async (req, res) => {
    // O middleware privateRoute já validou o token
    // O usuário estará disponível em req.user
    const authenticatedReq = req as any; // Cast temporário
    const user = authenticatedReq.user;
    const response = {
        valid: true,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    };
    res.json(response);
};   
