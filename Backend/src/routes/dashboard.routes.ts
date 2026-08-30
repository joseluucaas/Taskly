import { Router } from 'express';

import { controllers } from '../container.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();
const dashboardController = controllers.dashboard;

router.use(authMiddleware);

/**
 * @openapi
 * /dashboard:
 *   get:
 *     summary: Consultar o resumo de tarefas do usuário autenticado
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumo de tarefas e próximas pendências
 *       401:
 *         description: Token ausente, inválido ou expirado
 */
router.get('/', (req, res, next) =>
  dashboardController.getSummary(req, res, next)
);

export default router;
