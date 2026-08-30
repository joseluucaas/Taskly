import crypto from 'crypto';

import { prisma } from '../config/prisma.js';

export class RefreshTokenService {
  async create(userId: string) {
    const token = crypto.randomBytes(64).toString('hex');

    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + 30);

    const refreshToken = await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });

    return refreshToken;
  }

  async findByToken(token: string) {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: {
        token,
      },
    });

    return refreshToken;
  }

  async delete(token: string) {
    await prisma.refreshToken.delete({
      where: {
        token,
      },
    });
  }

  async deleteAllByUser(userId: string) {
    await prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  }
}
