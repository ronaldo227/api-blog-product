import { z } from 'zod';

// Schema de validação de post: limites de tamanho previnem XSS/DoS
export const CreatePostSchema = z.object({
  title: z.string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(200, 'Título não pode exceder 200 caracteres')
    .trim(),
  body: z.string()
    .min(10, 'Conteúdo deve ter pelo menos 10 caracteres')
    .max(100000, 'Conteúdo não pode exceder 100KB')
    .trim(),
  cover: z.string().optional()
});

export type CreatePostInput = z.infer<typeof CreatePostSchema>;
