import bcrypt from 'bcrypt';
import request from 'supertest';
import app from '../src/app.js';
import { prisma } from '../src/config/prisma.js';

describe('Notificações', () => {
  let token: string; let notificationId: string;
  beforeEach(async () => {
    await prisma.notification.deleteMany(); await prisma.user.deleteMany();
    const password = '123456'; const user = await prisma.user.create({ data: { name: 'Teste', email: 'notificacao@teste.com', passwordHash: await bcrypt.hash(password, 10) } });
    notificationId = (await prisma.notification.create({ data: { userId: user.id, title: 'Lembrete', message: 'Uma tarefa vence hoje' } })).id;
    token = (await request(app).post('/auth/login').send({ email: user.email, password })).body.data.accessToken;
  });
  afterAll(async () => { await prisma.$disconnect(); });
  it('lista, marca como lida e exclui notificações próprias', async () => {
    expect((await request(app).get('/notifications').set('Authorization', `Bearer ${token}`)).body.data).toHaveLength(1);
    expect((await request(app).patch(`/notifications/${notificationId}/read`).set('Authorization', `Bearer ${token}`)).body.data.readAt).toBeTruthy();
    expect((await request(app).delete(`/notifications/${notificationId}`).set('Authorization', `Bearer ${token}`)).status).toBe(204);
  });
});
