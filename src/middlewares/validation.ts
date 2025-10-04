/**
 * MIT License
 * Copyright (c) 2025 Ronaldo Silva
 * See LICENSE file in the project root for full license information.
 */
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { sanitizeBody } from './sanitize';
import { ValidationError } from './error-handler';

// 🔒 SCHEMAS DE VALIDAÇÃO MODERNOS

// Schema para autenticação
export const authSchemas = {
    signin: z.object({
        name: z.string()
            .min(2, 'Nome deve ter pelo menos 2 caracteres')
            .max(100, 'Nome deve ter no máximo 100 caracteres')
            .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
        email: z.string()
            .email('Email deve ter um formato válido')
            .toLowerCase()
            .transform(email => email.trim()),
        password: z.string()
            .min(6, 'Senha deve ter pelo menos 6 caracteres')
            .max(128, 'Senha deve ter no máximo 128 caracteres')
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número')
    }),
    
    signup: z.object({
        email: z.string()
            .email('Email deve ter um formato válido')
            .toLowerCase()
            .transform(email => email.trim()),
        password: z.string()
            .min(6, 'Senha deve ter pelo menos 6 caracteres')
            .max(128, 'Senha deve ter no máximo 128 caracteres')
    })
};

// Schema para posts
export const postSchemas = {
    create: z.object({
        title: z.string()
            .min(5, 'Título deve ter pelo menos 5 caracteres')
            .max(200, 'Título deve ter no máximo 200 caracteres')
            .transform(title => title.trim()),
        content: z.string()
            .min(10, 'Conteúdo deve ter pelo menos 10 caracteres')
            .max(10000, 'Conteúdo deve ter no máximo 10.000 caracteres'),
        slug: z.string()
            .min(3, 'Slug deve ter pelo menos 3 caracteres')
            .max(100, 'Slug deve ter no máximo 100 caracteres')
            .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens')
            .optional(),
        tags: z.array(z.string().min(1).max(50))
            .max(10, 'Máximo 10 tags permitidas')
            .optional()
    }),
    
    update: z.object({
        title: z.string()
            .min(5, 'Título deve ter pelo menos 5 caracteres')
            .max(200, 'Título deve ter no máximo 200 caracteres')
            .optional(),
        content: z.string()
            .min(10, 'Conteúdo deve ter pelo menos 10 caracteres')
            .max(10000, 'Conteúdo deve ter no máximo 10.000 caracteres')
            .optional(),
        tags: z.array(z.string().min(1).max(50))
            .max(10, 'Máximo 10 tags permitidas')
            .optional()
    })
};

// Schema para parâmetros de URL
export const paramSchemas = {
    slug: z.object({
        slug: z.string()
            .min(1, 'Slug é obrigatório')
            .max(100, 'Slug muito longo')
            .regex(/^[a-z0-9-]+$/, 'Slug inválido')
    }),
    
    id: z.object({
        id: z.string()
            .uuid('ID deve ser um UUID válido')
    })
};

// Schema para query parameters
export const querySchemas = {
    pagination: z.object({
        page: z.string()
            .regex(/^\d+$/, 'Página deve ser um número')
            .transform(Number)
            .refine(val => val > 0, 'Página deve ser maior que 0')
            .optional()
            .default(1),
        limit: z.string()
            .regex(/^\d+$/, 'Limite deve ser um número')
            .transform(Number)
            .refine(val => val > 0 && val <= 100, 'Limite deve ser entre 1 e 100')
            .optional()
            .default(10),
        search: z.string()
            .min(1, 'Termo de busca deve ter pelo menos 1 caractere')
            .max(100, 'Termo de busca deve ter no máximo 100 caracteres')
            .optional(),
        sortBy: z.enum(['createdAt', 'updatedAt', 'title'])
            .optional()
            .default('createdAt'),
        sortOrder: z.enum(['asc', 'desc'])
            .optional()
            .default('desc')
    })
};

// 🛡️ MIDDLEWARE DE VALIDAÇÃO GENÉRICO
export const validate = (schema: z.ZodSchema, property: 'body' | 'params' | 'query' = 'body') => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req[property];
            const validated = schema.parse(data);
            req[property] = validated;
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                    code: issue.code
                }));
                
                next(new ValidationError(`Dados inválidos: ${errorMessages.map(e => e.message).join(', ')}`));
            } else {
                next(error);
            }
        }
    };
};

// 🔧 MIDDLEWARES DE VALIDAÇÃO ESPECÍFICOS
export const validateSignin = validate(authSchemas.signin, 'body');
export const validateSignup = validate(authSchemas.signup, 'body');
export const validateCreatePost = validate(postSchemas.create, 'body');
export const validateUpdatePost = validate(postSchemas.update, 'body');
export const validateSlugParam = validate(paramSchemas.slug, 'params');
export const validateIdParam = validate(paramSchemas.id, 'params');
export const validatePagination = validate(querySchemas.pagination, 'query');

// (Sanitização agora unificada em sanitize.ts)
