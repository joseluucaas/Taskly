import bcrypt from 'bcrypt';
import request from 'supertest';

import app from '../src/app.js';
import { prisma } from '../src/config/prisma.js';


describe('Rotas de autenticação', () => {
  beforeEach(async () => {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('cadastra um usuário usando o padrão de resposta da API', async () => {
    const response = await request(app).post('/auth/register').send({
      name: 'Ana Silva',
      email: 'ana@teste.com',
      password: '123456',
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      success: true,
      data: {
        name: 'Ana Silva',
        email: 'ana@teste.com',
      },
    });
    expect(response.body.data.id).toBeDefined();
  });

  it('rejeita e-mail já cadastrado com erro padronizado', async () => {
    const passwordHash = await bcrypt.hash('123456', 10);

    await prisma.user.create({
      data: {
        name: 'Ana Silva',
        email: 'ana@teste.com',
        passwordHash,
      },
    });

    const response = await request(app).post('/auth/register').send({
      name: 'Ana Silva',
      email: 'ana@teste.com',
      password: '123456',
    });

    expect(response.status).toBe(409);
    expect(response.body).toMatchObject({
      success: false,
      error: { code: 'DUPLICATE_RECORD' },
    });
  });

  it('retorna access e refresh tokens para credenciais válidas', async () => {
    const passwordHash = await bcrypt.hash('123456', 10);

    await prisma.user.create({
      data: {
        name: 'José Lucas',
        email: 'jose@teste.com',
        passwordHash,
      },
    });

    const response = await request(app).post('/auth/login').send({
      email: 'jose@teste.com',
      password: '123456',
    });

    expect(response.status).toBe(200);
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.refreshToken).toBeDefined();
  });

  it('rejeita credenciais inválidas com mensagem em português', async () => {
    const passwordHash = await bcrypt.hash('123456', 10);

    await prisma.user.create({
      data: {
        name: 'José Lucas',
        email: 'jose@teste.com',
        passwordHash,
      },
    });

    const response = await request(app).post('/auth/login').send({
      email: 'jose@teste.com',
      password: 'senhaErrada',
    });

    expect(response.status).toBe(401);
    expect(response.body.error.message).toBe(
      'Email ou senha inválidos',
    );
  });
});
