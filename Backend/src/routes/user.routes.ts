import { Router } from 'express';

import { controllers } from '../container.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();
const userController = controllers.users;

router.use(authMiddleware);

router.get('/me', (req, res, next) => userController.findMe(req, res, next));
router.patch('/me', (req, res, next) =>
  userController.updateMe(req, res, next)
);
router.patch('/me/preferences', (req, res, next) =>
  userController.updatePreferences(req, res, next)
);
router.patch('/me/password', (req, res, next) =>
  userController.changePassword(req, res, next)
);
router.post('/me/logout-all', (req, res, next) =>
  userController.logoutAll(req, res, next)
);

export default router;
