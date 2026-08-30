import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
});

export const updatePreferencesSchema = z.object({
  language: z.enum(['pt', 'en']),
  theme: z.enum(['light', 'dark', 'system']),
  soundEnabled: z.boolean(),
  notificationsEnabled: z.boolean(),
  dueDateReminders: z.boolean(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Informe a senha atual'),
    newPassword: z
      .string()
      .min(6, 'A nova senha deve ter pelo menos 6 caracteres'),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'A nova senha deve ser diferente da senha atual',
    path: ['newPassword'],
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
