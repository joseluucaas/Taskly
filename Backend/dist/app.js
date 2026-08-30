import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
const app = express();
app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map