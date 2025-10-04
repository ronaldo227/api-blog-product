/**
 * MIT License
 * Copyright (c) 2025 Ronaldo Silva
 * See LICENSE file in the project root for full license information.
 */
import { Request, Response, NextFunction } from 'express';
import { AppLogger } from '../utils/logger-modern';
import { sendError } from '@/utils/http-error';

// 🚨 ERRO HANDLING GLOBAL MODERNO
export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
    code?: string;
}

export class CustomError extends Error implements AppError {
    public statusCode: number;
    public isOperational: boolean;
    public code?: string;

    constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.name = this.constructor.name;
        
        Error.captureStackTrace(this, this.constructor);
    }
}

// 🔧 Erros específicos da aplicação
export class ValidationError extends CustomError {
    constructor(message: string = 'Dados de entrada inválidos') {
        super(message, 400);
        this.code = 'VALIDATION_ERROR';
    }
}

export class AuthenticationError extends CustomError {
    constructor(message: string = 'Token de autenticação inválido') {
        super(message, 401);
        this.code = 'AUTH_ERROR';
    }
}

export class AuthorizationError extends CustomError {
    constructor(message: string = 'Acesso negado') {
        super(message, 403);
        this.code = 'AUTHORIZATION_ERROR';
    }
}

export class NotFoundError extends CustomError {
    constructor(message: string = 'Recurso não encontrado') {
        super(message, 404);
        this.code = 'NOT_FOUND';
    }
}

export class ConflictError extends CustomError {
    constructor(message: string = 'Conflito de dados') {
        super(message, 409);
        this.code = 'CONFLICT_ERROR';
    }
}

export class RateLimitError extends CustomError {
    constructor(message: string = 'Muitas tentativas. Tente novamente mais tarde') {
        super(message, 429);
        this.code = 'RATE_LIMIT_ERROR';
    }
}

// 🛡️ MIDDLEWARE DE TRATAMENTO DE ERRO GLOBAL
export const globalErrorHandler = (
    error: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Log do erro
    AppLogger.error('Global error caught:', {
        message: error.message,
        stack: error.stack,
        statusCode: error.statusCode,
        isOperational: error.isOperational,
        code: error.code,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('user-agent')
    });

    // Definir status code
    const statusCode = error.statusCode || 500;
    
    const isOperational = error.isOperational !== false;
    const message = isOperational ? error.message : 'Erro interno do servidor';
    const details = process.env.NODE_ENV === 'development' ? {
        stack: error.stack,
        url: req.url,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query
    } : undefined;

    sendError(res, {
        status: statusCode,
        code: error.code || 'INTERNAL_ERROR',
        message,
        details,
        logLevel: statusCode >= 500 ? 'error' : 'warn'
    });
};

// 🔄 MIDDLEWARE PARA CAPTURAR ERROS ASYNC
export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// 🚫 MIDDLEWARE PARA ROTAS NÃO ENCONTRADAS
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
    const error = new NotFoundError(`Rota ${req.method} ${req.url} não encontrada`);
    next(error);
};

// 🔧 HELPER PARA RESPONSES PADRONIZADAS
export const successResponse = (
    res: Response,
    data: any,
    message: string = 'Sucesso',
    statusCode: number = 200
) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        timestamp: new Date().toISOString()
    });
};

export const errorResponse = (
    res: Response,
    message: string,
    statusCode: number = 500,
    code?: string
) => {
    return res.status(statusCode).json({
        success: false,
        error: {
            message,
            code: code || 'ERROR',
            timestamp: new Date().toISOString()
        }
    });
};
