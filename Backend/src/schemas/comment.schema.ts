import { z } from 'zod';

export const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'O comentário é obrigatório')
    .max(1000, 'O comentário deve ter no máximo 1000 caracteres'),
});

export const updateCommentSchema = createCommentSchema;

export type CommentInput = z.infer<typeof createCommentSchema>;
