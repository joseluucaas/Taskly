import request from 'supertest';

import app from '../../src/app.js';


describe('Middleware de autenticação', () => {
  it('rejeita requisição sem token no padrão de erro da API', async () => {
    const response = await request(app).get('/tasks');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      success: false,
      error: {
        code: 'MISSING_TOKEN',
        message: 'Token não fornecido',
        details: null,
      },
    });
  });
});
