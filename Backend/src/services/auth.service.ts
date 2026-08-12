import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma.js';

export class AuthService {
  async register(nome: string, email: string, password: string) {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        nome,
        email,
        passwordHash,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true,
  },
    });

    return user;
  }
}