import { z } from 'zod';

const dateQuerySchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'A data deve estar no formato AAAA-MM-DD')
  .transform((value) => new Date(`${value}T00:00:00.000Z`));

export const listTasksQuerySchema = z
  .object({
    page: z.coerce
      .number()
      .int('A página deve ser um número inteiro')
      .min(1, 'A página deve ser maior que zero')
      .default(1),

    limit: z.coerce
      .number()
      .int('O limite deve ser um número inteiro')
      .min(1, 'O limite deve ser maior que zero')
      .max(100, 'O limite máximo é 100')
      .default(10),

    completed: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional(),

    search: z
      .string()
      .trim()
      .min(1, 'A busca não pode estar vazia')
      .max(100, 'A busca deve ter no máximo 100 caracteres')
      .optional(),

    dueDateFrom: dateQuerySchema.optional(),
    dueDateTo: dateQuerySchema.optional(),

    sort: z
      .enum(['createdAt', 'updatedAt', 'dueDate', 'title', 'completed'])
      .default('createdAt'),

    order: z.enum(['asc', 'desc']).default('desc'),
  })
  .refine(
    (data) => {
      if (!data.dueDateFrom || !data.dueDateTo) {
        return true;
      }

      return data.dueDateFrom <= data.dueDateTo;
    },
    {
      message: 'A data inicial não pode ser posterior à data final',
      path: ['dueDateTo'],
    }
  );

export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;
