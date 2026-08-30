import { z } from 'zod';


const colorSchema = z
  .string()
  .trim()
  .regex(/^#[0-9A-Fa-f]{6}$/, 'A cor deve estar no formato hexadecimal #RRGGBB');


export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'O nome da categoria é obrigatório')
    .max(50, 'O nome da categoria deve ter no máximo 50 caracteres'),
  color: colorSchema.optional(),
});


export const updateCategorySchema = createCategorySchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Informe ao menos um campo para atualização',
  });


export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
