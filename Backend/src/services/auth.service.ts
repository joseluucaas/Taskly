import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma.js';
import jwt from 'jsonwebtoken';


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


  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Email ou senha inválidos');
    }


    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      throw new Error('Email ou senha inválidos');
    }

    
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error('JWT_SECRET não configurado');
    }

    const token = jwt.sign({ sub: user.id }, jwtSecret, {
      expiresIn: '1d',
    });

    return { token };
  }
}