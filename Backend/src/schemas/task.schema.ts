import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'O título é obrigatório')
    .max(100, 'O título deve ter no máximo 100 caracteres'),

  description: z.string().optional(),

  dueDate: z.coerce.date().optional(),
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
});