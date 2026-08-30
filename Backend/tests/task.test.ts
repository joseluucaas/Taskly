import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../src/app.js';
import { prisma } from '../src/config/prisma.js';

describe('Task routes', () => {
  const createUserWithToken = async (email: string, name: string) => {
    const password = '123456';
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    const loginResponse = await request(app).post('/auth/login').send({
      email,
      password,
    });

    return {
      user,
      token: loginResponse.body.token,
    };
  };

  beforeEach(async () => {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('POST /tasks creates a task for an authenticated user', async () => {
    const { token } = await createUserWithToken('alice@teste.com', 'Alice');

    const response = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Estudar Express',
        description: 'Revisar middleware de autenticação',
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Estudar Express');
  });

  it('POST /tasks rejects requests without a token', async () => {
    const response = await request(app).post('/tasks').send({
      title: 'Sem token',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Token não fornecido');
  });

  it('POST /tasks rejects empty titles with validation errors', async () => {
    const { token } = await createUserWithToken('bob@teste.com', 'Bob');

    const response = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Dados inválidos');
    expect(response.body.errors[0].field).toBe('title');
  });

  it('GET /tasks lists only tasks from the authenticated user', async () => {
    const firstUser = await createUserWithToken('charlie@teste.com', 'Charlie');
    const secondUser = await createUserWithToken('diana@teste.com', 'Diana');

    await prisma.task.createMany({
      data: [
        { title: 'Tarefa do Charlie', userId: firstUser.user.id },
        { title: 'Tarefa da Diana', userId: secondUser.user.id },
      ],
    });

    const response = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${firstUser.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].userId).toBe(firstUser.user.id);
    expect(response.body[0].title).toBe('Tarefa do Charlie');
  });

  it('GET /tasks/:id returns 404 for a task that belongs to another user', async () => {
    const firstUser = await createUserWithToken('eric@teste.com', 'Eric');
    const secondUser = await createUserWithToken('fernanda@teste.com', 'Fernanda');

    const foreignTask = await prisma.task.create({
      data: {
        title: 'Tarefa de outra pessoa',
        userId: secondUser.user.id,
      },
    });

    const response = await request(app)
      .get(`/tasks/${foreignTask.id}`)
      .set('Authorization', `Bearer ${firstUser.token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Tarefa não encontrada');
  });

  it('PUT /tasks/:id and DELETE /tasks/:id update and remove tasks correctly', async () => {
    const { user, token } = await createUserWithToken('gabriel@teste.com', 'Gabriel');

    const created = await prisma.task.create({
      data: {
        title: 'Tarefa inicial',
        userId: user.id,
      },
    });

    const updateResponse = await request(app)
      .put(`/tasks/${created.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Tarefa atualizada',
        completed: true,
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.title).toBe('Tarefa atualizada');
    expect(updateResponse.body.completed).toBe(true);

    const deleteResponse = await request(app)
      .delete(`/tasks/${created.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteResponse.status).toBe(204);
  });
});
