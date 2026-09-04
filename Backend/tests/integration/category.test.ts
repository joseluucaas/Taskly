import bcrypt from 'bcrypt';
import request from 'supertest';

import app from '../../src/app.js';
import { prisma } from '../../src/config/prisma.js';


describe('Rotas de categorias', () => {
  const createUserWithToken = async (email: string) => {
    const password = '123456';
    const user = await prisma.user.create({
      data: {
        name: 'Usuário de categorias',
        email,
        passwordHash: await bcrypt.hash(password, 10),
      },
    });
    const loginResponse = await request(app).post('/auth/login').send({
      email,
      password,
    });

    return { user, token: loginResponse.body.data.accessToken as string };
  };

  beforeEach(async () => {
    await prisma.task.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('cria, lista, atualiza e exclui uma categoria do próprio usuário', async () => {
    const { token } = await createUserWithToken('categoria@teste.com');
    const createResponse = await request(app)
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Trabalho', color: '#2563EB' });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.data).toMatchObject({
      name: 'Trabalho',
      color: '#2563EB',
    });
    const categoryId = createResponse.body.data.id as string;

    const listResponse = await request(app)
      .get('/categories')
      .set('Authorization', `Bearer ${token}`);
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data).toHaveLength(1);
    expect(listResponse.body.data[0]._count.tasks).toBe(0);

    const updateResponse = await request(app)
      .put(`/categories/${categoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Projetos' });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data.name).toBe('Projetos');

    const deleteResponse = await request(app)
      .delete(`/categories/${categoryId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(deleteResponse.status).toBe(204);
  });

  it('impede acesso a categorias de outro usuário', async () => {
    const { token: ownerToken } = await createUserWithToken('dono@teste.com');
    const { token: otherToken } = await createUserWithToken('outro@teste.com');
    const categoryResponse = await request(app)
      .post('/categories')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ name: 'Pessoal' });
    const categoryId = categoryResponse.body.data.id as string;

    const response = await request(app)
      .get(`/categories/${categoryId}`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('CATEGORY_NOT_FOUND');
  });

  it('associa uma tarefa apenas a uma categoria do mesmo usuário', async () => {
    const { user, token } = await createUserWithToken('tarefa-categoria@teste.com');
    const { token: otherToken } = await createUserWithToken('outra-categoria@teste.com');
    const categoryResponse = await request(app)
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Estudos' });
    const categoryId = categoryResponse.body.data.id as string;

    const taskResponse = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Ler documentação', categoryId });
    expect(taskResponse.status).toBe(201);
    expect(taskResponse.body.data.categoryId).toBe(categoryId);

    const unauthorizedResponse = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ title: 'Não deve associar', categoryId });
    expect(unauthorizedResponse.status).toBe(404);
    expect(unauthorizedResponse.body.error.code).toBe('CATEGORY_NOT_FOUND');

    const deleteResponse = await request(app)
      .delete(`/categories/${categoryId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(deleteResponse.status).toBe(204);

    const task = await prisma.task.findFirstOrThrow({
      where: { userId: user.id, title: 'Ler documentação' },
    });
    expect(task.categoryId).toBeNull();
  });
});
