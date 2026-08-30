import winston from 'winston';

const isProduction = process.env.NODE_ENV === 'production';

const developmentFormat = winston.format.combine(
  winston.format.timestamp(),

  // Mostra níveis coloridos no terminal durante desenvolvimento.
  winston.format.colorize(),

  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const extra = Object.keys(meta).length
      ? JSON.stringify(meta, null, 2)
      : '';

    return `${timestamp} [${level}] ${message}${
      extra ? `\n${extra}` : ''
    }`;
  }),
);

const productionFormat = winston.format.combine(
  // JSON facilita integração com ferramentas de monitoramento.
  winston.format.timestamp(),
  winston.format.json(),
);

const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',

  format: isProduction
    ? productionFormat
    : developmentFormat,

  transports: [
    // Exibe logs no terminal.
    new winston.transports.Console(),

    ...(isProduction
      ? [
          // Guarda somente erros críticos.
          new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
          }),

          // Guarda todos os eventos da aplicação.
          new winston.transports.File({
            filename: 'logs/combined.log',
          }),
        ]
      : []),
  ],
});

export default logger;