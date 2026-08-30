import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../src/app.js';
import { prisma } from '../src/config/prisma.js';

describe('Auth routes', () => {
  beforeEach(async () => {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('POST /auth/register creates a new user', async () => {
    const response = await request(app).post('/auth/register').send({
      name: 'Ana Silva',
      email: 'ana@teste.com',
      password: '123456',
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: 'Ana Silva',
      email: 'ana@teste.com',
    });
    expect(response.body.id).toBeDefined();
  });

  it('POST /auth/register rejects duplicate emails', async () => {
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

    expect(response.status).toBe(500);
    expect(response.body.message).toBeDefined();
  });

  it('POST /auth/login returns a token when credentials are valid', async () => {
    const passwordHash = await bcrypt.hash('123456', 10);

    await prisma.user.create({
      data: {
        name: 'Jose Lucas',
        email: 'jose@teste.com',
        passwordHash,
      },
    });

    const response = await request(app).post('/auth/login').send({
      email: 'jose@teste.com',
      password: '123456',
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it('POST /auth/login returns a generic error for invalid credentials', async () => {
    const passwordHash = await bcrypt.hash('123456', 10);

    await prisma.user.create({
      data: {
        name: 'Jose Lucas',
        email: 'jose@teste.com',
        passwordHash,
      },
    });

    const response = await request(app).post('/auth/login').send({
      email: 'jose@teste.com',
      password: 'senhaErrada',
    });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Email ou senha inválidos');
  });
});
