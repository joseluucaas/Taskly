import { prisma } from '../config/prisma.js';
import { AppError } from '../errors/AppError.js';
import type { CreateTagInput, UpdateTagInput } from '../schemas/tag.schema.js';


export class TagService {
  async create(userId: string, data: CreateTagInput) {
    return prisma.tag.create({ data: { ...data, userId } });
  }

  async findAllByUser(userId: string) {
    return prisma.tag.findMany({
      where: { userId },
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
      include: { _count: { select: { tasks: true } } },
    });
  }

  async findByIdAndUser(id: string, userId: string) {
    return prisma.tag.findFirst({
      where: { id, userId },
      include: { _count: { select: { tasks: true } } },
    });
  }

  async update(id: string, userId: string, data: UpdateTagInput) {
    const tag = await this.findByIdAndUser(id, userId);

    if (!tag) {
      throw new AppError('Etiqueta não encontrada', 404, 'TAG_NOT_FOUND');
    }

    return prisma.tag.update({ where: { id }, data });
  }

  async delete(id: string, userId: string) {
    const tag = await this.findByIdAndUser(id, userId);

    if (!tag) {
      throw new AppError('Etiqueta não encontrada', 404, 'TAG_NOT_FOUND');
    }

    await prisma.tag.delete({ where: { id } });
  }
}
