import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma.js';

export class AuthService {
  async register(name: string, email: string, password: string) {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return user;
  }
}