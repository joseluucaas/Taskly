import { Router } from 'express';
import { controllers } from '../container.js';
import { validate } from '../middlewares/validate.middleware.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import { refreshTokenSchema } from '../schemas/refreshToken.schema.js';
import loginLimiter from '../middlewares/rateLimit.middleware.js';
const router = Router();
const authController = controllers.auth;
/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registrar um novo usuário
 *     tags: [Auth]
 */
router.post('/register', validate(registerSchema), (req, res, next) => authController.register(req, res, next));
/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Autenticar usuário
 *     tags: [Auth]
 */
router.post('/login', loginLimiter, validate(loginSchema), (req, res, next) => authController.login(req, res, next));
/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Renovar access token usando refresh token
 *     tags: [Auth]
 */
router.post('/refresh', validate(refreshTokenSchema), (req, res, next) => authController.refresh(req, res, next));
/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Realizar logout e invalidar refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenInput'
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *       401:
 *         description: Refresh token inválido
 */
router.post('/logout', validate(refreshTokenSchema), (req, res, next) => authController.logout(req, res, next));
export default router;
//# sourceMappingURL=auth.routes.js.map