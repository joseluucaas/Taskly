import { z } from 'zod';

const colorSchema = z
  .string()
  .trim()
  .regex(
    /^#[0-9A-Fa-f]{6}$/,
    'A cor deve estar no formato hexadecimal #RRGGBB'
  );

export const createTagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'O nome da etiqueta é obrigatório')
    .max(30, 'O nome da etiqueta deve ter no máximo 30 caracteres'),
  color: colorSchema.optional(),
});

export const updateTagSchema = createTagSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Informe ao menos um campo para atualização',
  });

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
