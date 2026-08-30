import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../errors/AppError.js';
import { createTagSchema, updateTagSchema } from '../schemas/tag.schema.js';
import { TagService } from '../services/tag.service.js';
import { successResponse } from '../utils/apiResponse.js';

export class TagController {
  constructor(private readonly tagService: TagService) {}

  private getTagId(req: Request): string {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new AppError('ID da etiqueta inválido', 400, 'INVALID_TAG_ID');
    }

    return id;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const tag = await this.tagService.create(
        req.userId!,
        createTagSchema.parse(req.body)
      );
      return res.status(201).json(successResponse(tag));
    } catch (error) {
      return next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const tags = await this.tagService.findAllByUser(req.userId!);
      return res.status(200).json(successResponse(tags));
    } catch (error) {
      return next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const tag = await this.tagService.findByIdAndUser(
        this.getTagId(req),
        req.userId!
      );
      if (!tag) {
        throw new AppError('Etiqueta não encontrada', 404, 'TAG_NOT_FOUND');
      }

      return res.status(200).json(successResponse(tag));
    } catch (error) {
      return next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const tag = await this.tagService.update(
        this.getTagId(req),
        req.userId!,
        updateTagSchema.parse(req.body)
      );
      return res.status(200).json(successResponse(tag));
    } catch (error) {
      return next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.tagService.delete(this.getTagId(req), req.userId!);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}
