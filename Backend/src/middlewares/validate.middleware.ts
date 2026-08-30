import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';

import { AppError } from '../errors/AppError.js';

export function validate(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      return next(
        new AppError('Dados inválidos', 400, 'VALIDATION_ERROR', errors)
      );
    }

    req.body = result.data;

    return next();
  };
}
