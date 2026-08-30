import { Request, Response, NextFunction } from 'express';
import { Prisma } from '../generated/prisma/client.js';

import { AppError } from '../errors/AppError.js';
import logger from '../config/logger.js';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  let statusCode = 500;
  let message = 'Erro interno do servidor';


  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }


  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {

      // Tentativa de criar registro duplicado
      case 'P2002':
        statusCode = 409;
        message = 'Registro já cadastrado';
        break;


      // Registro não encontrado
      case 'P2025':
        statusCode = 404;
        message = 'Registro não encontrado';
        break;
    }
  }


  logger.error(message, {
    statusCode,
    method: req.method,
    path: req.path,
    error: err instanceof Error ? err.stack : err,
  });


  return res.status(statusCode).json({
    message,
  });
}