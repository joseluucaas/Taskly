import { Router } from 'express';

import { CategoryController } from '../controllers/category.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../schemas/category.schema.js';


const router = Router();
const categoryController = new CategoryController();


router.use(authMiddleware);

/**
 * @openapi
 * /categories:
 *   get:
 *     summary: Listar categorias do usuário autenticado
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Criar uma categoria
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 */
router.route('/')
  .get((req, res, next) => categoryController.findAll(req, res, next))
  .post(
    validate(createCategorySchema),
    (req, res, next) => categoryController.create(req, res, next),
  );

/**
 * @openapi
 * /categories/{id}:
 *   get:
 *     summary: Buscar categoria por ID
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *   put:
 *     summary: Atualizar categoria
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Excluir categoria
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 */
router.route('/:id')
  .get((req, res, next) => categoryController.findOne(req, res, next))
  .put(
    validate(updateCategorySchema),
    (req, res, next) => categoryController.update(req, res, next),
  )
  .delete((req, res, next) => categoryController.delete(req, res, next));


export default router;
