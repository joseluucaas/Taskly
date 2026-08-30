import { NextFunction, Request, Response } from 'express';
import { ZodType } from 'zod';

import { AppError } from '../errors/AppError.js';


export function validateQuery(schema: ZodType) {
  return (
    req: Request,
    _res: Response,
    next: NextFunction,
  ) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      return next(
        new AppError(
          'Parâmetros de consulta inválidos',
          400,
          'VALIDATION_ERROR',
          errors,
        ),
      );
    }

    // A rota garante o formato; o controller faz o parse tipado antes de usar.
    return next();
  };
}
