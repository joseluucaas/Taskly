import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger.js';

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  const message = err instanceof Error ? err.message : 'Erro interno do servidor';

  logger.error(message, { path: req.path, method: req.method });

  const statusCode = message === 'Tarefa não encontrada' ? 404 : 500;

  return res.status(statusCode).json({ message });
}