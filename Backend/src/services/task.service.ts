import { Prisma } from '../generated/prisma/client.js';

import { prisma } from '../config/prisma.js';
import { AppError } from '../errors/AppError.js';
import logger from '../config/logger.js';
import { ListTasksQuery } from '../schemas/taskQuery.schema.js';


type TaskData = {
  title: string;
  description?: string;
  dueDate?: Date;
};

type UpdateTaskData = {
  title?: string;
  description?: string | null;
  completed?: boolean;
  dueDate?: Date;
};


export class TaskService {
  async create(userId: string, data: TaskData) {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        userId,
      },
    });

    logger.info('Tarefa criada com sucesso', {
      taskId: task.id,
      userId,
    });

    return task;
  }


  async findAllByUser(
    userId: string,
    query: ListTasksQuery,
  ) {
    const {
      page,
      limit,
      completed,
      search,
      dueDateFrom,
      dueDateTo,
      sort,
      order,
    } = query;

    const where: Prisma.TaskWhereInput = { userId };

    if (completed !== undefined) {
      where.completed = completed;
    }

    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (dueDateFrom || dueDateTo) {
      // A data final inclui o dia inteiro, e não apenas a meia-noite.
      where.dueDate = {
        ...(dueDateFrom ? { gte: dueDateFrom } : {}),
        ...(dueDateTo
          ? {
              lte: new Date(
                Date.UTC(
                  dueDateTo.getUTCFullYear(),
                  dueDateTo.getUTCMonth(),
                  dueDateTo.getUTCDate(),
                  23,
                  59,
                  59,
                  999,
                ),
              ),
            }
          : {}),
      };
    }

    const orderBy: Prisma.TaskOrderByWithRelationInput[] = [
      { [sort]: order },
      // Empates recebem uma segunda ordenação para páginas sempre previsíveis.
      { id: 'asc' },
    ];

    // Lista e total são consultados juntos para que os metadados correspondam
    // ao mesmo recorte de dados da página retornada.
    const [tasks, totalItems] = await prisma.$transaction([
      prisma.task.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.task.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    logger.debug('Tarefas listadas com sucesso', {
      userId,
      page,
      limit,
      totalItems,
    });

    return {
      tasks,
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }


  async findByIdAndUser(id: string, userId: string) {
    return prisma.task.findFirst({
      where: { id, userId },
    });
  }


  async update(
    id: string,
    userId: string,
    data: UpdateTaskData,
  ) {
    const existingTask = await this.findByIdAndUser(id, userId);

    if (!existingTask) {
      throw new AppError('Tarefa não encontrada', 404, 'TASK_NOT_FOUND');
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data,
    });

    logger.info('Tarefa atualizada com sucesso', {
      taskId: updatedTask.id,
      userId,
    });

    return updatedTask;
  }


  async delete(id: string, userId: string) {
    const existingTask = await this.findByIdAndUser(id, userId);

    if (!existingTask) {
      throw new AppError('Tarefa não encontrada', 404, 'TASK_NOT_FOUND');
    }

    await prisma.task.delete({ where: { id } });

    logger.info('Tarefa removida com sucesso', {
      taskId: id,
      userId,
    });
  }
}
