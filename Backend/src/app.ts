import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import authRoutes from './routes/auth.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import taskRoutes from './routes/task.routes.js';

import { errorHandler } from './middlewares/errorHandler.middleware.js';
import swaggerSpec from './config/swagger.js';

const app = express();

// ─────────────────────────────────────────────
// Middlewares globais
// ─────────────────────────────────────────────

// Helmet: adiciona headers de segurança HTTP (proteção contra
// ataques comuns como XSS, sniffing de MIME type, etc).
app.use(helmet());

// CORS: libera o acesso da API para o frontend.
// Em produção, usa a URL definida em FRONTEND_URL;
// em desenvolvimento, libera qualquer origem.
app.use(
  cors({
    origin: process.env.FRONTEND_URL || true,
  }),
);

// Habilita o parsing automático de JSON no corpo das requisições.
app.use(express.json());

// ─────────────────────────────────────────────
// Documentação (Swagger/OpenAPI)
// ─────────────────────────────────────────────

// Disponível apenas fora de produção, evitando expor
// a documentação da API publicamente.
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Atalho amigável para acessar a documentação.
  app.get('/docs', (_req, res) => {
    res.redirect('/api-docs');
  });

  app.get('/openapi.json', (_req, res) => {
    res.json(swaggerSpec);
  });
}

// ─────────────────────────────────────────────
// Health check
// ─────────────────────────────────────────────

// Usado para monitoramento (ex: Docker, CI/CD, uptime checks)
// verificar se a API está de pé.
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// ─────────────────────────────────────────────
// Rotas principais
// ─────────────────────────────────────────────

app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/tasks', taskRoutes);

// ─────────────────────────────────────────────
// Tratamento de erros
// ─────────────────────────────────────────────

// Importante: precisa ser o ÚLTIMO middleware registrado,
// pois o Express só chama error handlers depois de todos
// os outros middlewares/rotas.
app.use(errorHandler);

export default app;