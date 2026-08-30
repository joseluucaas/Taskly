import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { prisma } from '../config/prisma.js';
import { AppError } from '../errors/AppError.js';
import logger from '../config/logger.js';

import { RefreshTokenService } from './refreshToken.service.js';


const refreshTokenService = new RefreshTokenService();



export class AuthService {

  async register(
    name: string,
    email: string,
    password: string,
  ) {

    const passwordHash = await bcrypt.hash(
      password,
      10,
    );


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





  async login(
    email: string,
    password: string,
  ) {

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });



    if (!user) {

      logger.warn(
        'Tentativa de login com usuário inexistente',
        {
          email,
        },
      );


      throw new AppError(
        'Email ou senha inválidos',
        401,
        'INVALID_CREDENTIALS',
      );
    }




    const passwordMatches =
      await bcrypt.compare(
        password,
        user.passwordHash,
      );



    if (!passwordMatches) {

      logger.warn(
        'Tentativa de login com senha inválida',
        {
          email,
        },
      );


      throw new AppError(
        'Email ou senha inválidos',
        401,
        'INVALID_CREDENTIALS',
      );
    }




    const jwtSecret = process.env.JWT_SECRET;



    if (!jwtSecret) {

      logger.error(
        'JWT_SECRET não configurado',
      );


      throw new AppError(
        'Configuração interna inválida',
        500,
        'JWT_CONFIGURATION_ERROR',
      );
    }




    const accessToken = jwt.sign(
      {
        sub: user.id,
      },

      jwtSecret,

      {
        expiresIn: '15m',
      },
    );




    const refreshToken =
      await refreshTokenService.create(
        user.id,
      );




    logger.info(
      'Login realizado com sucesso',
      {
        userId: user.id,
        email: user.email,
      },
    );



    return {

      accessToken,

      refreshToken: refreshToken.token,

      // O front-end precisa de dados públicos para personalizar a experiência
      // após o login. A senha e o hash nunca são expostos nesta resposta.
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },

    };
  }





  async refresh(
    refreshToken: string,
  ) {

    const storedToken =
      await refreshTokenService.findByToken(
        refreshToken,
      );



    if (!storedToken) {

      throw new AppError(
        'Refresh token inválido',
        401,
        'INVALID_REFRESH_TOKEN',
      );
    }




    if (storedToken.expiresAt < new Date()) {

      await refreshTokenService.delete(
        refreshToken,
      );


      throw new AppError(
        'Refresh token expirado',
        401,
        'EXPIRED_REFRESH_TOKEN',
      );
    }




    const jwtSecret = process.env.JWT_SECRET;



    if (!jwtSecret) {

      logger.error(
        'JWT_SECRET não configurado',
      );


      throw new AppError(
        'Configuração interna inválida',
        500,
        'JWT_CONFIGURATION_ERROR',
      );
    }




    const accessToken = jwt.sign(
      {
        sub: storedToken.userId,
      },

      jwtSecret,

      {
        expiresIn: '15m',
      },
    );




    logger.info(
      'Access token renovado com sucesso',
      {
        userId: storedToken.userId,
      },
    );



    return {
      accessToken,
    };
  }





  async logout(
    refreshToken: string,
  ) {

    const storedToken =
      await refreshTokenService.findByToken(
        refreshToken,
      );


    if (!storedToken) {

      throw new AppError(
        'Refresh token inválido',
        401,
        'INVALID_REFRESH_TOKEN',
      );
    }



    await refreshTokenService.delete(
      refreshToken,
    );



    logger.info(
      'Logout realizado com sucesso',
      {
        userId: storedToken.userId,
      },
    );

  }

}
