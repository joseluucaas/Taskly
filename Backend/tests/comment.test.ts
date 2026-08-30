import bcrypt from 'bcrypt';
import request from 'supertest';
import app from '../src/app.js';
import { prisma } from '../src/config/prisma.js';

describe('Comentários', () => {
  let token: string; let taskId: string;
  beforeEach(async () => {
    await prisma.comment.deleteMany(); await prisma.task.deleteMany(); await prisma.user.deleteMany();
    const password = '123456'; const user = await prisma.user.create({ data: { name: 'Teste', email: 'comentario@teste.com', passwordHash: await bcrypt.hash(password, 10) } });
    taskId = (await prisma.task.create({ data: { title: 'Tarefa', userId: user.id } })).id;
    token = (await request(app).post('/auth/login').send({ email: user.email, password })).body.data.accessToken;
  });
  afterAll(async () => { await prisma.$disconnect(); });
  it('cria, lista, atualiza e remove comentário', async () => {
    const create = await request(app).post(`/tasks/${taskId}/comments`).set('Authorization', `Bearer ${token}`).send({ content: 'Primeiro comentário' });
    expect(create.status).toBe(201); const id = create.body.data.id as string;
    expect((await request(app).get(`/tasks/${taskId}/comments`).set('Authorization', `Bearer ${token}`)).body.data).toHaveLength(1);
    expect((await request(app).put(`/tasks/${taskId}/comments/${id}`).set('Authorization', `Bearer ${token}`).send({ content: 'Atualizado' })).body.data.content).toBe('Atualizado');
    expect((await request(app).delete(`/tasks/${taskId}/comments/${id}`).set('Authorization', `Bearer ${token}`)).status).toBe(204);
  });
});
