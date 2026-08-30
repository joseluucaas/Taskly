import { Router } from 'express';
import { controllers } from '../container.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
const router = Router();
const notificationController = controllers.notifications;
router.use(authMiddleware);
/**
 * @openapi
 * /notifications:
 *   get:
 *     summary: Listar notificações do usuário autenticado
 *     tags: [Notificações]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/', (req, res, next) =>
  notificationController.findAll(req, res, next)
);
router.patch('/:id/read', (req, res, next) =>
  notificationController.markAsRead(req, res, next)
);
router.delete('/:id', (req, res, next) =>
  notificationController.delete(req, res, next)
);
export default router;
