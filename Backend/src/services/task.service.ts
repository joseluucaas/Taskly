import { prisma } from '../config/prisma.js';


export class TaskService {

  async create(userId: string, data: { title: string; description?: string; dueDate?: Date }) {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        userId,
      },
    });
    return task;

  }

  async findAllByUser(userId: string) {
    const tasks = await prisma.task.findMany({
      where: { userId },
    });
    return tasks;

  }

  async findByIdAndUser(id: string, userId: string) {
    const task = await prisma.task.findFirst({
    where: { id, userId },
    });

  return task; 

}

async update(
  id: string,
  userId: string,
  data: Partial<{ title: string; description: string; completed: boolean; dueDate: Date }>
) {
  const existingTask = await this.findByIdAndUser(id, userId);

  if (!existingTask) {
    throw new Error('Tarefa não encontrada');
  }

  const updatedTask = await prisma.task.update({
  where: { id, userId },
    data,
  });

  return updatedTask;
}

async delete(id: string, userId: string) {
  const existingTask = await this.findByIdAndUser(id, userId);

  if (!existingTask) {
    throw new Error('Tarefa não encontrada');
  }

  await prisma.task.delete({
  where: { id, userId },
  });
}

}

