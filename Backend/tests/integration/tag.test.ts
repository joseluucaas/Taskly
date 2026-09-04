import bcrypt from 'bcrypt';
import request from 'supertest';

import app from '../../src/app.js';
import { prisma } from '../../src/config/prisma.js';


describe('Rotas de etiquetas', () => {
  const createUserWithToken = async (email: string) => {
    const password = '123456';
    const user = await prisma.user.create({
      data: { name: 'Usuário de etiquetas', email, passwordHash: await bcrypt.hash(password, 10) },
    });
    const login = await request(app).post('/auth/login').send({ email, password });
    return { user, token: login.body.data.accessToken as string };
  };

  beforeEach(async () => {
    await prisma.task.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('cria, atualiza e lista etiquetas do próprio usuário', async () => {
    const { token } = await createUserWithToken('etiqueta@teste.com');
    const create = await request(app)
      .post('/tags')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Urgente', color: '#DC2626' });

    expect(create.status).toBe(201);
    const id = create.body.data.id as string;

    const update = await request(app)
      .put(`/tags/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Prioridade alta' });
    expect(update.status).toBe(200);
    expect(update.body.data.name).toBe('Prioridade alta');

    const list = await request(app).get('/tags').set('Authorization', `Bearer ${token}`);
    expect(list.body.data).toHaveLength(1);
    expect(list.body.data[0]._count.tasks).toBe(0);
  });

  it('não permite associar à tarefa uma etiqueta de outro usuário', async () => {
    const { token: ownerToken } = await createUserWithToken('dono-tag@teste.com');
    const { token: otherToken } = await createUserWithToken('outro-tag@teste.com');
    const tag = await request(app)
      .post('/tags')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ name: 'Privada' });

    const response = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ title: 'Tarefa inválida', tagIds: [tag.body.data.id] });

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('TAG_NOT_FOUND');
  });

  it('associa e remove etiquetas de uma tarefa', async () => {
    const { token } = await createUserWithToken('associar-tag@teste.com');
    const tag = await request(app)
      .post('/tags')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Backend' });
    const tagId = tag.body.data.id as string;

    const task = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Implementar API', tagIds: [tagId] });
    expect(task.status).toBe(201);

    const taskId = task.body.data.id as string;
    const update = await request(app)
      .put(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ tagIds: [] });
    expect(update.status).toBe(200);
    expect(update.body.data.tags).toEqual([]);
  });
});
