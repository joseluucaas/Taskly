import { Router } from 'express';

import { AuthController } from '../controllers/auth.controller.js';

import { validate } from '../middlewares/validate.middleware.js';

import {
  registerSchema,
  loginSchema,
} from '../schemas/auth.schema.js';

import loginLimiter from '../middlewares/rateLimit.middleware.js';


const router = Router();

const authController = new AuthController();


/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registrar um novo usuário
 *     tags: [Auth]
 */
router.post(
  '/register',
  validate(registerSchema),
  (req, res) =>
    authController.register(req, res),
);


/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Autenticar usuário
 *     tags: [Auth]
 */
router.post(
  '/login',
  loginLimiter,
  validate(loginSchema),
  (req, res) =>
    authController.login(req, res),
);


export default router;