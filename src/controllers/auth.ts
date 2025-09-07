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
    console.log('👤 SUPER DEBUG SIGNIN - START:', {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        headers: {
            contentType: req.headers['content-type'],
            userAgent: req.headers['user-agent'],
            origin: req.headers.origin
        },
        bodyKeys: Object.keys(req.body || {}),
        bodyData: {
            hasName: !!req.body?.name,
            hasEmail: !!req.body?.email,
            hasPassword: !!req.body?.password,
            nameLength: req.body?.name?.length || 0,
            emailLength: req.body?.email?.length || 0,
            passwordLength: req.body?.password?.length || 0
        }
    });

    console.log('👤 SUPER DEBUG SIGNIN - Validating schema...');
    const data = signinSchema.safeParse(req.body);

    if (!data.success) {
        const validationErrors = data.error.flatten().fieldErrors;
        console.log('👤 SUPER DEBUG SIGNIN - VALIDATION FAILED:', {
            errors: validationErrors,
            errorCount: Object.keys(validationErrors).length,
            zodErrors: data.error.issues
        });
        res.json({ error: validationErrors });
        return;
    }

    const validatedData = data.data;
    console.log('👤 SUPER DEBUG SIGNIN - VALIDATION SUCCESS:', {
        validatedEmail: validatedData.email,
        validatedName: validatedData.name,
        passwordLength: validatedData.password.length
    });

    console.log('👤 SUPER DEBUG SIGNIN - Creating user...');
    const user = await createUser(validatedData);
    
    if (!user) {
        console.log('👤 SUPER DEBUG SIGNIN - USER CREATION FAILED');
        res.json({ error: 'erro ao criar usuario' });
        return;
    }

    console.log('👤 SUPER DEBUG SIGNIN - USER CREATED SUCCESS:', {
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        userStatus: user.status
    });

    console.log('👤 SUPER DEBUG SIGNIN - Creating token...');
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

    console.log('👤 SUPER DEBUG SIGNIN - FINAL SUCCESS:', {
        responseUser: response.user,
        tokenGenerated: !!token,
        tokenLength: token?.length || 0
    });

    res.status(201).json(response);
};

// Controlador para fazer login
export const signup: RequestHandler = async (req, res) => {
    console.log('🔐 SUPER DEBUG SIGNUP - START:', {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        headers: {
            contentType: req.headers['content-type'],
            userAgent: req.headers['user-agent'],
            origin: req.headers.origin
        },
        bodyKeys: Object.keys(req.body || {}),
        bodyData: {
            hasEmail: !!req.body?.email,
            hasPassword: !!req.body?.password,
            emailLength: req.body?.email?.length || 0,
            passwordLength: req.body?.password?.length || 0
        }
    });

    console.log('🔐 SUPER DEBUG SIGNUP - Validating schema...');
    const data = signupSchema.safeParse(req.body);

    if (!data.success) {
        const validationErrors = data.error.flatten().fieldErrors;
        console.log('🔐 SUPER DEBUG SIGNUP - VALIDATION FAILED:', {
            errors: validationErrors,
            errorCount: Object.keys(validationErrors).length,
            zodErrors: data.error.issues
        });
        res.json({ error: validationErrors });
        return;
    }

    const validatedData = data.data;
    console.log('🔐 SUPER DEBUG SIGNUP - VALIDATION SUCCESS:', {
        validatedEmail: validatedData.email,
        passwordLength: validatedData.password.length
    });

    console.log('🔐 SUPER DEBUG SIGNUP - Verifying user credentials...');
    const user = await verifyUser({ email: validatedData.email, password: validatedData.password });
    
    if (!user) {
        console.log('🔐 SUPER DEBUG SIGNUP - USER VERIFICATION FAILED');
        res.json({ error: 'credenciais inválidas' });
        return;
    }

    console.log('🔐 SUPER DEBUG SIGNUP - USER VERIFIED SUCCESS:', {
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        userStatus: user.status
    });

    console.log('🔐 SUPER DEBUG SIGNUP - Creating token...');
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

    console.log('🔐 SUPER DEBUG SIGNUP - FINAL SUCCESS:', {
        responseUser: response.user,
        tokenGenerated: !!token,
        tokenLength: token?.length || 0
    });

    res.json(response);
};

// Controlador para validar token
export const validate: RequestHandler = async (req, res) => {
    console.log('✅ SUPER DEBUG VALIDATE - START:', {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        hasUserInRequest: !!(req as any).user
    });

    // O middleware privateRoute já validou o token
    // O usuário estará disponível em req.user
    const authenticatedReq = req as any; // Cast temporário
    const user = authenticatedReq.user;

    console.log('✅ SUPER DEBUG VALIDATE - User from request:', {
        userId: user?.id,
        userEmail: user?.email,
        userName: user?.name
    });

    const response = {
        valid: true,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    };

    console.log('✅ SUPER DEBUG VALIDATE - FINAL SUCCESS:', response);

    res.json(response);
};   
