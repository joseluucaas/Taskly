import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),

  email: z.string().email('Email inválido'),

  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),

  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

// Tipos gerados automaticamente pelo Zod
export type RegisterInput = z.infer<typeof registerSchema>;

export type LoginInput = z.infer<typeof loginSchema>;
