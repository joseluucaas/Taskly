import jwt from 'jsonwebtoken';
export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }
    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Formato de token inválido' });
    }
    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET não configurado');
        }
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.sub;
        return next();
    }
    catch {
        return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
}
//# sourceMappingURL=auth.middleware.js.map