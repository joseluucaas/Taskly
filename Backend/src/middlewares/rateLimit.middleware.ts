import rateLimit from 'express-rate-limit';

const isTestEnvironment =
  process.env.NODE_ENV === 'test';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  // Durante testes permitimos vários logins
  // para que o Jest consiga criar usuários.
  // Em produção continua protegido.
  max: isTestEnvironment ? 1000 : 5,

  message: {
    message:
      'Muitas tentativas de login. Tente novamente mais tarde.',
  },

  standardHeaders: true,
  legacyHeaders: false,
});

export default loginLimiter;