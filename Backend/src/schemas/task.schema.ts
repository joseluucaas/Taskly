import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  description: z.string().optional(),
  dueDate: z.coerce.date().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório').optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
  dueDate: z.coerce.date().optional(),
});