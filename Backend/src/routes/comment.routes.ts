import { Router } from 'express';
import { controllers } from '../container.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createCommentSchema,
  updateCommentSchema,
} from '../schemas/comment.schema.js';

const router = Router();
const commentController = controllers.comments;
router.use(authMiddleware);

/**
 * @openapi
 * /tasks/{taskId}/comments:
 *   get:
 *     summary: Listar comentários de uma tarefa
 *     tags: [Comentários]
 *     security: [{ bearerAuth: [] }]
 *   post:
 *     summary: Criar comentário em uma tarefa
 *     tags: [Comentários]
 *     security: [{ bearerAuth: [] }]
 */
router
  .route('/tasks/:taskId/comments')
  .get((req, res, next) => commentController.findAll(req, res, next))
  .post(validate(createCommentSchema), (req, res, next) =>
    commentController.create(req, res, next)
  );
router
  .route('/tasks/:taskId/comments/:id')
  .put(validate(updateCommentSchema), (req, res, next) =>
    commentController.update(req, res, next)
  )
  .delete((req, res, next) => commentController.delete(req, res, next));
export default router;
