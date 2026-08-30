import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';
import { AppError } from '../errors/AppError.js';
export function authMiddleware(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return next(new AppError('Token não fornecido', 401, 'MISSING_TOKEN'));
    }
    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
        logger.warn('Tentativa de autenticação com formato inválido', {
            path: req.path,
        });
        return next(new AppError('Formato de token inválido', 401, 'INVALID_TOKEN_FORMAT'));
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        logger.error('JWT_SECRET não configurado');
        return next(new AppError('Configuração interna inválida', 500, 'JWT_CONFIGURATION_ERROR'));
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        // O `sub` identifica o dono do token. Ele é usado nas consultas para
        // garantir que cada usuário enxergue apenas os próprios recursos.
        if (!decoded.sub) {
            throw new AppError('Token inválido', 401, 'INVALID_TOKEN');
        }
        req.userId = decoded.sub;
        return next();
    }
    catch (error) {
        if (error instanceof AppError) {
            return next(error);
        }
        logger.warn('Token inválido ou expirado', {
            path: req.path,
            method: req.method,
        });
        return next(new AppError('Token inválido ou expirado', 401, 'INVALID_OR_EXPIRED_TOKEN'));
    }
}
//# sourceMappingURL=auth.middleware.js.map