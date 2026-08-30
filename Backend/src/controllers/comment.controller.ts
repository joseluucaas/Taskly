import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError.js';
import { createCommentSchema, updateCommentSchema } from '../schemas/comment.schema.js';
import { CommentService } from '../services/comment.service.js';
import { successResponse } from '../utils/apiResponse.js';

const commentService = new CommentService();
export class CommentController {
  private param(req: Request, name: 'taskId' | 'id') { const value = req.params[name]; if (!value || Array.isArray(value)) throw new AppError('ID inválido', 400, 'INVALID_ID'); return value; }
  async create(req: Request, res: Response, next: NextFunction) { try { return res.status(201).json(successResponse(await commentService.create(this.param(req, 'taskId'), req.userId!, createCommentSchema.parse(req.body)))); } catch (error) { return next(error); } }
  async findAll(req: Request, res: Response, next: NextFunction) { try { return res.json(successResponse(await commentService.findAll(this.param(req, 'taskId'), req.userId!))); } catch (error) { return next(error); } }
  async update(req: Request, res: Response, next: NextFunction) { try { return res.json(successResponse(await commentService.update(this.param(req, 'id'), this.param(req, 'taskId'), req.userId!, updateCommentSchema.parse(req.body)))); } catch (error) { return next(error); } }
  async delete(req: Request, res: Response, next: NextFunction) { try { await commentService.delete(this.param(req, 'id'), this.param(req, 'taskId'), req.userId!); return res.status(204).send(); } catch (error) { return next(error); } }
}
