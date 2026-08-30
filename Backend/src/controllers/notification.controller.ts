import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError.js';
import { NotificationService } from '../services/notification.service.js';
import { successResponse } from '../utils/apiResponse.js';
const notificationService = new NotificationService();
export class NotificationController {
  private id(req: Request) { const { id } = req.params; if (!id || Array.isArray(id)) throw new AppError('ID da notificação inválido', 400, 'INVALID_NOTIFICATION_ID'); return id; }
  async findAll(req: Request, res: Response, next: NextFunction) { try { return res.json(successResponse(await notificationService.findAll(req.userId!))); } catch (error) { return next(error); } }
  async markAsRead(req: Request, res: Response, next: NextFunction) { try { return res.json(successResponse(await notificationService.markAsRead(this.id(req), req.userId!))); } catch (error) { return next(error); } }
  async delete(req: Request, res: Response, next: NextFunction) { try { await notificationService.delete(this.id(req), req.userId!); return res.status(204).send(); } catch (error) { return next(error); } }
}
