import { Request, Response, NextFunction } from 'express';
import { Prisma } from '../generated/prisma/client.js';

import { AppError } from '../errors/AppError.js';
import logger from '../config/logger.js';

import { errorResponse } from '../utils/apiResponse.js';


export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  let statusCode = 500;
  let message = 'Erro interno do servidor';
  let code = 'INTERNAL_ERROR';
  let details: unknown = null;


  // Erros personalizados da aplicação
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code;
    details = err.details ?? null;
  }


  // Erros conhecidos do Prisma
  if (err instanceof Prisma.PrismaClientKnownRequestError) {

    switch (err.code) {

      // Registro duplicado
      case 'P2002':
        statusCode = 409;
        message = 'Registro já cadastrado';
        code = 'DUPLICATE_RECORD';
        break;


      // Registro não encontrado
      case 'P2025':
        statusCode = 404;
        message = 'Registro não encontrado';
        code = 'NOT_FOUND';
        break;
    }
  }


  logger.error(message, {
    statusCode,
    code,
    method: req.method,
    path: req.path,
    error: err instanceof Error ? err.stack : err,
  });


  return res.status(statusCode).json(
    errorResponse(
      code,
      message,
      details,
    ),
  );
}