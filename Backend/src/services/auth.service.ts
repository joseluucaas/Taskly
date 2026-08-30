import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { prisma } from '../config/prisma.js';
import { AppError } from '../errors/AppError.js';
import logger from '../config/logger.js';

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

    logger.info('Usuário criado com sucesso', {
      userId: user.id,
      email: user.email,
    });

    return user;
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      logger.warn('Tentativa de login com usuário inexistente', {
        email,
      });

      throw new AppError(
        'Email ou senha inválidos',
        401,
      );
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      logger.warn('Tentativa de login com senha inválida', {
        email,
      });

      throw new AppError(
        'Email ou senha inválidos',
        401,
      );
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      logger.error('JWT_SECRET não configurado');

      throw new AppError(
        'Configuração interna inválida',
        500,
      );
    }

    const token = jwt.sign(
      {
        sub: user.id,
      },
      jwtSecret,
      {
        expiresIn: '1d',
      },
    );

    logger.info('Login realizado com sucesso', {
      userId: user.id,
      email: user.email,
    });

    return {
      token,
    };
  }
}