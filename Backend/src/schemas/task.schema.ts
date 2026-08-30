import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'O título é obrigatório')
    .max(100, 'O título deve ter no máximo 100 caracteres'),

  description: z.string().optional(),

  dueDate: z.coerce.date().optional(),

  categoryId: z
    .uuid('A categoria selecionada é inválida')
    .nullable()
    .optional(),

  tagIds: z
    .array(z.uuid('A etiqueta selecionada é inválida'))
    .max(20, 'Uma tarefa pode ter no máximo 20 etiquetas')
    .optional(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'O título é obrigatório')
    .max(100, 'O título deve ter no máximo 100 caracteres')
    .optional(),

  description: z.string().nullable().optional(),

  completed: z.boolean().optional(),

  dueDate: z.coerce.date().optional(),

  categoryId: z
    .uuid('A categoria selecionada é inválida')
    .nullable()
    .optional(),

  tagIds: z
    .array(z.uuid('A etiqueta selecionada é inválida'))
    .max(20, 'Uma tarefa pode ter no máximo 20 etiquetas')
    .optional(),
});

// Tipos gerados automaticamente pelo Zod

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
