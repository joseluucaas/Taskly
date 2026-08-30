import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos

  max: 5, // máximo de 5 tentativas

  message: {
    message: 'Muitas tentativas de login. Tente novamente mais tarde.',
  },

  standardHeaders: true,
  legacyHeaders: false,
});

export default loginLimiter;