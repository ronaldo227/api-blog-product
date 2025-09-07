import { Request, Response } from 'express';
import { createToken, verifyRequest } from '../services/auth';
import { createUser, verifyUser } from '../services/user';
import { 
    asyncHandler, 
    successResponse, 
    ValidationError, 
    AuthenticationError,
    ConflictError 
} from '../middlewares/error-handler';
import { AppLogger } from '../utils/logger-modern';

// 🔐 CONTROLLER DE AUTENTICAÇÃO MODERNO

// Criar conta (signin)
export const signin = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    
    AppLogger.auth('Signin attempt', { email, name: name?.substring(0, 3) + '***' });
    
    try {
        // Criar novo usuário diretamente (createUser já verifica se existe)
        const user = await createUser({ name, email, password });
        
        if (!user) {
            AppLogger.auth('Signin failed - user creation failed', { email });
            throw new ConflictError('Erro ao criar usuário. Email pode já estar em uso.');
        }
        
        // Gerar token
        const token = createToken(user);
        
        AppLogger.auth('Signin successful', { 
            userId: user.id, 
            email: user.email,
            tokenGenerated: !!token 
        });
        
        return successResponse(res, {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                status: user.status
            },
            token
        }, 'Conta criada com sucesso', 201);
        
    } catch (error) {
        AppLogger.error('Signin error', { 
            email, 
            error: error instanceof Error ? error.message : error 
        });
        throw error;
    }
});

// Fazer login (signup)
export const signup = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    AppLogger.auth('Signup attempt', { email });
    
    try {
        // Verificar credenciais
        const user = await verifyUser({ email, password });
        
        if (!user) {
            AppLogger.auth('Signup failed - invalid credentials', { email });
            throw new AuthenticationError('Email ou senha inválidos');
        }
        
        // Gerar token
        const token = createToken(user);
        
        AppLogger.auth('Signup successful', { 
            userId: user.id, 
            email: user.email,
            tokenGenerated: !!token 
        });
        
        return successResponse(res, {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                status: user.status
            },
            token
        }, 'Login realizado com sucesso');
        
    } catch (error) {
        AppLogger.error('Signup error', { 
            email, 
            error: error instanceof Error ? error.message : error 
        });
        throw error;
    }
});

// Validar token
export const validate = asyncHandler(async (req: Request, res: Response) => {
    AppLogger.auth('Token validation attempt', { 
        hasAuth: !!req.headers.authorization,
        userAgent: req.get('user-agent')
    });
    
    try {
        const user = await verifyRequest(req);
        
        if (!user) {
            AppLogger.auth('Token validation failed - invalid token');
            throw new AuthenticationError('Token inválido ou expirado');
        }
        
        AppLogger.auth('Token validation successful', { 
            userId: user.id, 
            email: user.email 
        });
        
        return successResponse(res, {
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            tokenValid: true
        }, 'Token válido');
        
    } catch (error) {
        AppLogger.error('Token validation error', { 
            error: error instanceof Error ? error.message : error 
        });
        throw error;
    }
});
