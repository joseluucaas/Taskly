import { Router } from 'express';

import { TaskController } from '../controllers/task.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { validateQuery } from '../middlewares/validateQuery.middleware.js';
import {
  createTaskSchema,
  updateTaskSchema,
} from '../schemas/task.schema.js';
import { listTasksQuerySchema } from '../schemas/taskQuery.schema.js';


const router = Router();
const taskController = new TaskController();


router.use(authMiddleware);


/**
 * @openapi
 * /tasks:
 *   post:
 *     summary: Criar uma nova tarefa
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  '/',
  validate(createTaskSchema),
  (req, res, next) =>
    taskController.create(req, res, next),
);


/**
 * @openapi
 * /tasks:
 *   get:
 *     summary: Listar tarefas do usuário autenticado
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 10 }
 *       - in: query
 *         name: completed
 *         schema: { type: boolean }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: dueDateFrom
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: dueDateTo
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [createdAt, updatedAt, dueDate, title, completed], default: createdAt }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc], default: desc }
 */
router.get(
  '/',
  validateQuery(listTasksQuerySchema),
  (req, res, next) =>
    taskController.findAll(req, res, next),
);


/**
 * @openapi
 * /tasks/{id}:
 *   get:
 *     summary: Buscar tarefa por ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  '/:id',
  (req, res, next) =>
    taskController.findOne(req, res, next),
);


/**
 * @openapi
 * /tasks/{id}:
 *   put:
 *     summary: Atualizar tarefa
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  '/:id',
  validate(updateTaskSchema),
  (req, res, next) =>
    taskController.update(req, res, next),
);


/**
 * @openapi
 * /tasks/{id}:
 *   delete:
 *     summary: Excluir tarefa
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *       
 */
router.delete(
  '/:id',
  (req, res, next) =>
    taskController.delete(req, res, next),
);


export default router;
