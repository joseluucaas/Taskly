import { prisma } from '../config/prisma.js';
import { AppError } from '../errors/AppError.js';
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../schemas/category.schema.js';

export class CategoryService {
  async create(userId: string, data: CreateCategoryInput) {
    return prisma.category.create({
      data: { ...data, userId },
    });
  }

  async findAllByUser(userId: string) {
    return prisma.category.findMany({
      where: { userId },
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
      include: { _count: { select: { tasks: true } } },
    });
  }

  async findByIdAndUser(id: string, userId: string) {
    return prisma.category.findFirst({
      where: { id, userId },
      include: { _count: { select: { tasks: true } } },
    });
  }

  async update(id: string, userId: string, data: UpdateCategoryInput) {
    const category = await this.findByIdAndUser(id, userId);

    if (!category) {
      throw new AppError('Categoria não encontrada', 404, 'CATEGORY_NOT_FOUND');
    }

    return prisma.category.update({ where: { id }, data });
  }

  async delete(id: string, userId: string) {
    const category = await this.findByIdAndUser(id, userId);

    if (!category) {
      throw new AppError('Categoria não encontrada', 404, 'CATEGORY_NOT_FOUND');
    }

    await prisma.category.delete({ where: { id } });
  }
}
