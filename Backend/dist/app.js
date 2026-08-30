import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/auth.routes.js';
import categoryRoutes from './routes/category.routes.js';
import commentRoutes from './routes/comment.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import tagRoutes from './routes/tag.routes.js';
import taskRoutes from './routes/task.routes.js';
import userRoutes from './routes/user.routes.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import swaggerSpec from './config/swagger.js';
const app = express();
const frontendUrl = process.env.FRONTEND_URL;
const allowedOrigins = frontendUrl
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
if (process.env.NODE_ENV === 'production' && !frontendUrl) {
    throw new Error('FRONTEND_URL deve ser configurada em produção');
}
// ─────────────────────────────────────────────
// Middlewares globais
// ─────────────────────────────────────────────
// Helmet: adiciona headers de segurança HTTP.
app.use(helmet());
// CORS: permite comunicação com o frontend.
// Em produção, deve usar uma origem específica.
app.use(cors({
    origin: allowedOrigins?.length ? allowedOrigins : true,
}));
// Permite receber JSON no body das requisições.
app.use(express.json({ limit: '100kb' }));
// ─────────────────────────────────────────────
// Swagger / OpenAPI
// ─────────────────────────────────────────────
// Documentação disponível apenas em desenvolvimento.
if (process.env.NODE_ENV !== 'production') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get('/docs', (_req, res) => {
        res.redirect('/api-docs');
    });
    app.get('/openapi.json', (_req, res) => {
        res.json(swaggerSpec);
    });
}
// ─────────────────────────────────────────────
// Health Check
// ─────────────────────────────────────────────
// Endpoint usado para verificar se a API está funcionando.
app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
    });
});
// ─────────────────────────────────────────────
// Rotas da aplicação
// ─────────────────────────────────────────────
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/categories', categoryRoutes);
app.use('/', commentRoutes);
app.use('/notifications', notificationRoutes);
app.use('/tags', tagRoutes);
app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);
// ─────────────────────────────────────────────
// Middleware global de erros
// ─────────────────────────────────────────────
// IMPORTANTE:
// Deve ser sempre o último middleware.
// Ele captura erros lançados pelas rotas,
// controllers e services.
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map