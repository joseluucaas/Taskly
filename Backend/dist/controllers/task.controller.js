import { TaskService } from '../services/task.service.js';
const taskService = new TaskService();
export class TaskController {
    getTaskId(req) {
        const { id } = req.params;
        if (Array.isArray(id)) {
            return id[0] ?? null;
        }
        return id ?? null;
    }
    async create(req, res) {
        const { title, description, dueDate } = req.body;
        const userId = req.userId;
        const task = await taskService.create(userId, { title, description, dueDate });
        return res.status(201).json(task);
    }
    async findAll(req, res) {
        const userId = req.userId;
        const tasks = await taskService.findAllByUser(userId);
        return res.status(200).json(tasks);
    }
    async findOne(req, res) {
        const id = this.getTaskId(req);
        const userId = req.userId;
        if (!id) {
            return res.status(400).json({ message: 'ID da tarefa inválido' });
        }
        const task = await taskService.findByIdAndUser(id, userId);
        if (!task) {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }
        return res.status(200).json(task);
    }
    async update(req, res) {
        const id = this.getTaskId(req);
        const userId = req.userId;
        const data = req.body;
        if (!id) {
            return res.status(400).json({ message: 'ID da tarefa inválido' });
        }
        try {
            const updatedTask = await taskService.update(id, userId, data);
            return res.status(200).json(updatedTask);
        }
        catch {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }
    }
    async delete(req, res) {
        const id = this.getTaskId(req);
        const userId = req.userId;
        if (!id) {
            return res.status(400).json({ message: 'ID da tarefa inválido' });
        }
        try {
            await taskService.delete(id, userId);
            return res.status(204).send();
        }
        catch {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }
    }
}
//# sourceMappingURL=task.controller.js.map