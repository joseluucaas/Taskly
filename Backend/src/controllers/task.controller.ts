import { NextFunction, Request, Response } from 'express';

import { AppError } from '../errors/AppError.js';
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schema.js';
import { listTasksQuerySchema } from '../schemas/taskQuery.schema.js';
import { TaskService } from '../services/task.service.js';
import { successResponse } from '../utils/apiResponse.js';

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  private getTaskId(req: Request): string | null {
    const { id } = req.params;

    if (Array.isArray(id)) {
      return id[0] ?? null;
    }

    return id ?? null;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createTaskSchema.parse(req.body);
      const task = await this.taskService.create(req.userId!, data);

      return res.status(201).json(successResponse(task));
    } catch (error) {
      return next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      // O middleware já valida a query; este parse mantém o controller seguro
      // se ele também for reutilizado fora da rota HTTP.
      const query = listTasksQuerySchema.parse(req.query);
      const result = await this.taskService.findAllByUser(req.userId!, query);

      return res.status(200).json(successResponse(result.tasks, result.meta));
    } catch (error) {
      return next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id = this.getTaskId(req);

      if (!id) {
        throw new AppError('ID da tarefa inválido', 400, 'INVALID_TASK_ID');
      }

      const task = await this.taskService.findByIdAndUser(id, req.userId!);

      if (!task) {
        throw new AppError('Tarefa não encontrada', 404, 'TASK_NOT_FOUND');
      }

      return res.status(200).json(successResponse(task));
    } catch (error) {
      return next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = this.getTaskId(req);

      if (!id) {
        throw new AppError('ID da tarefa inválido', 400, 'INVALID_TASK_ID');
      }

      const data = updateTaskSchema.parse(req.body);
      const updatedTask = await this.taskService.update(id, req.userId!, data);

      return res.status(200).json(successResponse(updatedTask));
    } catch (error) {
      return next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = this.getTaskId(req);

      if (!id) {
        throw new AppError('ID da tarefa inválido', 400, 'INVALID_TASK_ID');
      }

      await this.taskService.delete(id, req.userId!);

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}
