import { Router } from 'express';

import { controllers } from '../container.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createTagSchema, updateTagSchema } from '../schemas/tag.schema.js';

const router = Router();
const tagController = controllers.tags;

router.use(authMiddleware);

/**
 * @openapi
 * /tags:
 *   get:
 *     summary: Listar etiquetas do usuário autenticado
 *     tags: [Etiquetas]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Criar uma etiqueta
 *     tags: [Etiquetas]
 *     security:
 *       - bearerAuth: []
 */
router
  .route('/')
  .get((req, res, next) => tagController.findAll(req, res, next))
  .post(validate(createTagSchema), (req, res, next) =>
    tagController.create(req, res, next)
  );

/**
 * @openapi
 * /tags/{id}:
 *   get:
 *     summary: Buscar etiqueta por ID
 *     tags: [Etiquetas]
 *     security:
 *       - bearerAuth: []
 *   put:
 *     summary: Atualizar etiqueta
 *     tags: [Etiquetas]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Excluir etiqueta
 *     tags: [Etiquetas]
 *     security:
 *       - bearerAuth: []
 */
router
  .route('/:id')
  .get((req, res, next) => tagController.findOne(req, res, next))
  .put(validate(updateTagSchema), (req, res, next) =>
    tagController.update(req, res, next)
  )
  .delete((req, res, next) => tagController.delete(req, res, next));

export default router;
