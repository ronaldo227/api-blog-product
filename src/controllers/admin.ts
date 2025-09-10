
import { prisma } from "@/libs/prisma";
import { ExtendedRequest } from "@/types/extended-resquest";
import { Response } from "express";
import { slugify } from "transliteration";

/** Adiciona um novo post autenticado ao banco de dados */

// Controlador para adicionar um post (exemplo de rota protegida)
export const addPost = async (req: ExtendedRequest, res: Response) => {
    if (!req.userId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const { title, body } = req.body;
    let cover = "";
    if (req.file && req.file.filename) {
        cover = req.file.filename;
    }

    if (!title || !body) {
        return res.status(400).json({ error: "Título e conteúdo são obrigatórios" });
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
    } catch (error) {
        console.error("Erro ao criar post:", error);
        return res.status(500).json({ error: "Erro ao criar post" });
    }
};