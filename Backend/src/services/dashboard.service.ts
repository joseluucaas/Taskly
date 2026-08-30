import { prisma } from '../config/prisma.js';

export class DashboardService {
  async getSummary(userId: string) {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfTomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );

    const [total, completed, overdue, dueToday, upcomingTasks] =
      await prisma.$transaction([
        prisma.task.count({ where: { userId } }),
        prisma.task.count({ where: { userId, completed: true } }),
        prisma.task.count({
          where: {
            userId,
            completed: false,
            dueDate: { lt: startOfToday },
          },
        }),
        prisma.task.count({
          where: {
            userId,
            completed: false,
            dueDate: { gte: startOfToday, lt: startOfTomorrow },
          },
        }),
        prisma.task.findMany({
          where: {
            userId,
            completed: false,
            dueDate: { gte: startOfToday },
          },
          orderBy: [{ dueDate: 'asc' }, { id: 'asc' }],
          take: 5,
        }),
      ]);

    return {
      summary: {
        total,
        completed,
        pending: total - completed,
        overdue,
        dueToday,
      },
      upcomingTasks,
    };
  }
}
