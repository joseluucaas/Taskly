import { Router } from 'express';
import { TaskController } from '../controllers/task.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schema.js';

const router = Router();

const taskController = new TaskController();

router.use(authMiddleware);

router.post('/', validate(createTaskSchema), (req, res) => taskController.create(req, res));
router.get('/', (req, res) => taskController.findAll(req, res));
router.get('/:id', (req, res) => taskController.findOne(req, res));
router.put('/:id', validate(updateTaskSchema), (req, res) => taskController.update(req, res));
router.delete('/:id', (req, res) => taskController.delete(req, res));

export default router;