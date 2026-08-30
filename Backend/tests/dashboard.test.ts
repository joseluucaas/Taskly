import bcrypt from 'bcrypt';
import request from 'supertest';

import app from '../src/app.js';
import { prisma } from '../src/config/prisma.js';


describe('Rota de dashboard', () => {
  const createUserWithToken = async () => {
    const password = '123456';
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: 'Usuário do dashboard',
        email: 'dashboard@teste.com',
        passwordHash,
      },
    });
    const loginResponse = await request(app).post('/auth/login').send({
      email: user.email,
      password,
    });

    return { user, token: loginResponse.body.data.accessToken as string };
  };

  beforeEach(async () => {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('retorna somente o resumo das tarefas do usuário autenticado', async () => {
    const { user, token } = await createUserWithToken();
    const otherUser = await prisma.user.create({
      data: {
        name: 'Outro usuário',
        email: 'outro-dashboard@teste.com',
        passwordHash: await bcrypt.hash('123456', 10),
      },
    });
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 12);
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 12);

    await prisma.task.createMany({
      data: [
        { title: 'Concluída', completed: true, userId: user.id },
        { title: 'Vencida', dueDate: yesterday, userId: user.id },
        { title: 'Para hoje', dueDate: today, userId: user.id },
        { title: 'Próxima', dueDate: tomorrow, userId: user.id },
        { title: 'De outro usuário', userId: otherUser.id },
      ],
    });

    const response = await request(app)
      .get('/dashboard')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      data: {
        summary: {
          total: 4,
          completed: 1,
          pending: 3,
          overdue: 1,
          dueToday: 1,
        },
      },
    });
    expect(response.body.data.upcomingTasks.map((task: { title: string }) => task.title)).toEqual([
      'Para hoje',
      'Próxima',
    ]);
  });

  it('exige autenticação', async () => {
    const response = await request(app).get('/dashboard');

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('MISSING_TOKEN');
  });
});
