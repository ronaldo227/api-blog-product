import { RequestHandler, Response } from 'express';
import { createUser, verifyUser } from '@/services/user';
import { createToken } from '@/services/auth';
import { AppLogger } from '@/utils/logger-modern';
import { ExtendedRequest } from '@/types/extended-resquest';
import { SignupSchema, SigninSchema } from '@/schemas/auth';
import { sendError } from '@/utils/http-error';

// Helper local para mascarar corpo em logs
const maskBody = (body: any) => ({ ...body, password: body?.password ? '***' : undefined });

// Signup: cria novo usuário
export const signup: RequestHandler = async (req, res) => {
    const safeBody = maskBody(req.body);
    AppLogger.debug('[auth:signup] request body', safeBody);
    const parsed = SignupSchema.safeParse(req.body);
    if (!parsed.success) {
        const details = parsed.error.flatten().fieldErrors;
        return sendError(res, {
            status: 400,
            code: 'AUTH_INVALID_DATA',
            message: 'Dados inválidos',
            details
        });
    }
    try {
        const user = await createUser(parsed.data);
        if (!user) {
            return sendError(res, {
                status: 409,
                code: 'AUTH_USER_EXISTS',
                message: 'Usuário já cadastrado'
            });
        }
        const token = createToken(user);
        AppLogger.info('[auth:signup] user created', { id: user.id, email: user.email });
        return res.status(201).json({
            user: { id: user.id, name: user.name, email: user.email, status: user.status },
            token
        });
    } catch (err) {
        return sendError(res, {
            status: 500,
            code: 'AUTH_SIGNUP_ERROR',
            message: 'Erro interno ao criar usuário',
            details: (err as any)?.message,
            logLevel: 'error'
        });
    }
};

// Signin: autentica usuário existente
export const signin: RequestHandler = async (req, res) => {
    const safeBody = maskBody(req.body);
    AppLogger.debug('[auth:signin] request body', safeBody);
    const parsed = SigninSchema.safeParse(req.body);
    if (!parsed.success) {
        const details = parsed.error.flatten().fieldErrors;
        return sendError(res, {
            status: 400,
            code: 'AUTH_INVALID_CREDENTIALS',
            message: 'Credenciais inválidas',
            details
        });
    }
    try {
        const user = await verifyUser(parsed.data);
        if (!user) {
            return sendError(res, {
                status: 401,
                code: 'AUTH_UNAUTHORIZED',
                message: 'Não autorizado'
            });
        }
        const token = createToken(user);
        AppLogger.info('[auth:signin] user authenticated', { id: user.id, email: user.email });
        return res.status(200).json({
            user: { id: user.id, name: user.name, email: user.email, status: (user as any).status },
            token
        });
    } catch (err) {
        return sendError(res, {
            status: 500,
            code: 'AUTH_SIGNIN_ERROR',
            message: 'Erro interno ao autenticar',
            details: (err as any)?.message,
            logLevel: 'error'
        });
    }
};

// Validate token
export const validate = (req: ExtendedRequest, res: Response) => {
    if (!req.userId) {
        return sendError(res, {
            status: 401,
            code: 'AUTH_UNAUTHORIZED',
            message: 'Não autorizado'
        });
    }
    AppLogger.info('[auth:validate] user authenticated', { id: req.userId.id, email: req.userId.email });
    return res.json({
        valid: true,
        user: {
            id: req.userId.id,
            name: req.userId.name,
            email: req.userId.email
        }
    });
};
