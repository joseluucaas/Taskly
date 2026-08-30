import { prisma } from '../config/prisma.js';
export class TaskService {
    async create(userId, data) {
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
    async findAllByUser(userId) {
        const tasks = await prisma.task.findMany({
            where: { userId },
        });
        return tasks;
    }
    async findByIdAndUser(id, userId) {
        const task = await prisma.task.findFirst({
            where: { id, userId },
        });
        return task;
    }
    async update(id, userId, data) {
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
    async delete(id, userId) {
        const existingTask = await this.findByIdAndUser(id, userId);
        if (!existingTask) {
            throw new Error('Tarefa não encontrada');
        }
        await prisma.task.delete({
            where: { id, userId },
        });
    }
}
//# sourceMappingURL=task.service.js.map