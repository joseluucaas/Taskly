import bcrypt from 'bcrypt';

import { prisma } from '../config/prisma.js';
import { AppError } from '../errors/AppError.js';
import type {
  ChangePasswordInput,
  UpdatePreferencesInput,
  UpdateProfileInput,
} from '../schemas/user.schema.js';

const profileSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  preferences: true,
} as const;

export class UserService {
  async findProfile(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: profileSelect });
    if (!user) throw new AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND');

    const preferences = user.preferences ?? await prisma.userPreference.create({ data: { userId } });
    return { ...user, preferences };
  }

  async updateProfile(userId: string, data: UpdateProfileInput) {
    const existingEmail = await prisma.user.findFirst({ where: { email: data.email, NOT: { id: userId } }, select: { id: true } });
    if (existingEmail) throw new AppError('Já existe uma conta com este email', 409, 'EMAIL_ALREADY_IN_USE');

    const user = await prisma.user.update({ where: { id: userId }, data, select: profileSelect });
    const preferences = user.preferences ?? await prisma.userPreference.create({ data: { userId } });
    return { ...user, preferences };
  }

  async updatePreferences(userId: string, data: UpdatePreferencesInput) {
    return prisma.userPreference.upsert({ where: { userId }, update: data, create: { userId, ...data } });
  }

  async changePassword(userId: string, data: ChangePasswordInput) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { passwordHash: true } });
    if (!user) throw new AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND');

    const matches = await bcrypt.compare(data.currentPassword, user.passwordHash);
    if (!matches) throw new AppError('A senha atual está incorreta', 400, 'INVALID_CURRENT_PASSWORD');

    await prisma.$transaction([
      prisma.user.update({ where: { id: userId }, data: { passwordHash: await bcrypt.hash(data.newPassword, 10) } }),
      prisma.refreshToken.deleteMany({ where: { userId } }),
    ]);
  }

  async logoutAll(userId: string) {
    await prisma.refreshToken.deleteMany({ where: { userId } });
  }
}
