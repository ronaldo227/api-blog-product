
import { prisma } from "@/libs/prisma";
import { ExtendedRequest } from "@/types/extended-resquest";
import { Response } from "express";
import { slugify } from "transliteration";
import { sendError } from '@/utils/http-error';
import { AppLogger } from '@/utils/logger-modern';
import { CreatePostSchema } from '@/schemas/post';

/** Adiciona um novo post autenticado ao banco de dados */

// Controlador para adicionar um post (exemplo de rota protegida)
export const addPost = async (req: ExtendedRequest, res: Response) => {
    // privateRoute já garante req.userId; guard extra para TS
    if (!req.userId) {
        return sendError(res, { status: 401, code: 'AUTH_UNAUTHORIZED', message: 'Não autenticado' });
    }

    const parsed = CreatePostSchema.safeParse(req.body);
    if (!parsed.success) {
        const details = parsed.error.flatten().fieldErrors;
        return sendError(res, {
            status: 400,
            code: 'ADMIN_POST_INVALID',
            message: 'Dados do post inválidos',
            details
        });
    }

    const { title, body } = parsed.data;
    let cover = "";
    if (req.file && req.file.filename) {
        cover = req.file.filename;
    }

    let baseSlug = slugify(title, { lowercase: true, separator: '-' });
    let slug = baseSlug;
    let count = 1;
    while (await prisma.post.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${count++}`;
    }

    try {
        const newPost = await prisma.post.create({
            data: {
                title,
                slug,
                body,
                cover,
                authorId: req.userId.id
            }
        });
        return res.status(201).json(newPost);
    } catch (error: any) {
        AppLogger.error('Erro ao criar post', { error: error?.message });
        return sendError(res, {
            status: 500,
            code: 'ADMIN_POST_CREATE_ERROR',
            message: 'Erro ao criar post',
            details: error?.message,
            logLevel: 'error'
        });
    }
};