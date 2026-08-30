import { AuthController } from './controllers/auth.controller.js';
import { CategoryController } from './controllers/category.controller.js';
import { CommentController } from './controllers/comment.controller.js';
import { DashboardController } from './controllers/dashboard.controller.js';
import { NotificationController } from './controllers/notification.controller.js';
import { TagController } from './controllers/tag.controller.js';
import { TaskController } from './controllers/task.controller.js';
import { UserController } from './controllers/user.controller.js';
import { AuthService } from './services/auth.service.js';
import { CategoryService } from './services/category.service.js';
import { CommentService } from './services/comment.service.js';
import { DashboardService } from './services/dashboard.service.js';
import { NotificationService } from './services/notification.service.js';
import { RefreshTokenService } from './services/refreshToken.service.js';
import { TagService } from './services/tag.service.js';
import { TaskService } from './services/task.service.js';
import { UserService } from './services/user.service.js';

// Ponto único de composição: rotas recebem controllers já configurados,
// enquanto cada controller recebe explicitamente seu serviço.
const refreshTokenService = new RefreshTokenService();
const authService = new AuthService(refreshTokenService);
const categoryService = new CategoryService();
const commentService = new CommentService();
const dashboardService = new DashboardService();
const notificationService = new NotificationService();
const tagService = new TagService();
const taskService = new TaskService();
const userService = new UserService();

export const controllers = {
  auth: new AuthController(authService),
  categories: new CategoryController(categoryService),
  comments: new CommentController(commentService),
  dashboard: new DashboardController(dashboardService),
  notifications: new NotificationController(notificationService),
  tags: new TagController(tagService),
  tasks: new TaskController(taskService),
  users: new UserController(userService),
};
