import { prisma } from '../config/prisma.js';
import { AppError } from '../errors/AppError.js';
import type { CommentInput } from '../schemas/comment.schema.js';

export class CommentService {
  private async ensureTaskOwner(taskId: string, userId: string) {
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId },
      select: { id: true },
    });
    if (!task)
      throw new AppError('Tarefa não encontrada', 404, 'TASK_NOT_FOUND');
  }
  async create(taskId: string, userId: string, data: CommentInput) {
    await this.ensureTaskOwner(taskId, userId);
    return prisma.comment.create({ data: { ...data, taskId } });
  }
  async findAll(taskId: string, userId: string) {
    await this.ensureTaskOwner(taskId, userId);
    return prisma.comment.findMany({
      where: { taskId },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    });
  }
  async update(id: string, taskId: string, userId: string, data: CommentInput) {
    await this.ensureTaskOwner(taskId, userId);
    const comment = await prisma.comment.findFirst({ where: { id, taskId } });
    if (!comment)
      throw new AppError('Comentário não encontrado', 404, 'COMMENT_NOT_FOUND');
    return prisma.comment.update({ where: { id }, data });
  }
  async delete(id: string, taskId: string, userId: string) {
    await this.ensureTaskOwner(taskId, userId);
    const result = await prisma.comment.deleteMany({ where: { id, taskId } });
    if (result.count === 0)
      throw new AppError('Comentário não encontrado', 404, 'COMMENT_NOT_FOUND');
  }
}
