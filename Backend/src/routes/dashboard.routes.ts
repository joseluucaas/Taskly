import { Router } from 'express';

import { DashboardController } from '../controllers/dashboard.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';


const router = Router();
const dashboardController = new DashboardController();


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
  dashboardController.getSummary(req, res, next),
);


export default router;
