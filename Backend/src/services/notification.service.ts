import { prisma } from '../config/prisma.js';
import { AppError } from '../errors/AppError.js';

export class NotificationService {
  async findAll(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });
  }
  async markAsRead(id: string, userId: string) {
    const notification = await prisma.notification.findFirst({
      where: { id, userId },
    });
    if (!notification)
      throw new AppError(
        'Notificação não encontrada',
        404,
        'NOTIFICATION_NOT_FOUND'
      );
    return prisma.notification.update({
      where: { id },
      data: { readAt: notification.readAt ?? new Date() },
    });
  }
  async delete(id: string, userId: string) {
    const result = await prisma.notification.deleteMany({
      where: { id, userId },
    });
    if (!result.count)
      throw new AppError(
        'Notificação não encontrada',
        404,
        'NOTIFICATION_NOT_FOUND'
      );
  }
}
