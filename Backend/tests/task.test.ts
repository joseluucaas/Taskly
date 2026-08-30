import bcrypt from 'bcrypt';
import request from 'supertest';

import app from '../src/app.js';
import { prisma } from '../src/config/prisma.js';


describe('Rotas de tarefas', () => {
  const createUserWithToken = async (email: string, name: string) => {
    const password = '123456';
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, passwordHash },
    });

    const loginResponse = await request(app).post('/auth/login').send({
      email,
      password,
    });

    return {
      user,
      token: loginResponse.body.data.accessToken as string,
    };
  };

  beforeEach(async () => {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('cria uma tarefa para um usuário autenticado', async () => {
    const { token } = await createUserWithToken('alice@teste.com', 'Alice');

    const response = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Estudar Express' });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      success: true,
      data: { title: 'Estudar Express', completed: false },
    });
  });

  it('lista tarefas com paginação e metadados', async () => {
    const { user, token } = await createUserWithToken(
      'bruno@teste.com',
      'Bruno',
    );

    await prisma.task.createMany({
      data: ['Uma', 'Duas', 'Três'].map((title) => ({
        title,
        userId: user.id,
      })),
    });

    const response = await request(app)
      .get('/tasks?page=2&limit=2&sort=title&order=asc')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.meta).toEqual({
      page: 2,
      limit: 2,
      totalItems: 3,
      totalPages: 2,
      hasNextPage: false,
      hasPreviousPage: true,
    });
  });

  it('filtra tarefas por conclusão, título e período de vencimento', async () => {
    const { user, token } = await createUserWithToken(
      'carla@teste.com',
      'Carla',
    );

    await prisma.task.createMany({
      data: [
        {
          title: 'Preparar apresentação',
          completed: false,
          dueDate: new Date('2026-08-20T12:00:00.000Z'),
          userId: user.id,
        },
        {
          title: 'Enviar relatório',
          completed: true,
          dueDate: new Date('2026-08-22T12:00:00.000Z'),
          userId: user.id,
        },
      ],
    });

    const response = await request(app)
      .get(
        '/tasks?completed=false&search=apresentação&dueDateFrom=2026-08-20&dueDateTo=2026-08-20',
      )
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].title).toBe('Preparar apresentação');
  });

  it('ordena tarefas pelo campo permitido', async () => {
    const { user, token } = await createUserWithToken(
      'diana@teste.com',
      'Diana',
    );

    await prisma.task.createMany({
      data: [
        { title: 'Zebra', userId: user.id },
        { title: 'Abelha', userId: user.id },
      ],
    });

    const response = await request(app)
      .get('/tasks?sort=title&order=asc')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.map((task: { title: string }) => task.title)).toEqual([
      'Abelha',
      'Zebra',
    ]);
  });

  it('rejeita parâmetros de consulta inválidos', async () => {
    const { token } = await createUserWithToken('eva@teste.com', 'Eva');

    const response = await request(app)
      .get('/tasks?page=0&completed=sim')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      success: false,
      error: { code: 'VALIDATION_ERROR' },
    });
  });
});
