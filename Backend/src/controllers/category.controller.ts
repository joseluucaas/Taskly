import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../errors/AppError.js';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../schemas/category.schema.js';
import { CategoryService } from '../services/category.service.js';
import { successResponse } from '../utils/apiResponse.js';


const categoryService = new CategoryService();


export class CategoryController {
  private getCategoryId(req: Request): string {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new AppError('ID da categoria inválido', 400, 'INVALID_CATEGORY_ID');
    }

    return id;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.create(
        req.userId!,
        createCategorySchema.parse(req.body),
      );

      return res.status(201).json(successResponse(category));
    } catch (error) {
      return next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoryService.findAllByUser(req.userId!);

      return res.status(200).json(successResponse(categories));
    } catch (error) {
      return next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.findByIdAndUser(
        this.getCategoryId(req),
        req.userId!,
      );

      if (!category) {
        throw new AppError('Categoria não encontrada', 404, 'CATEGORY_NOT_FOUND');
      }

      return res.status(200).json(successResponse(category));
    } catch (error) {
      return next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.update(
        this.getCategoryId(req),
        req.userId!,
        updateCategorySchema.parse(req.body),
      );

      return res.status(200).json(successResponse(category));
    } catch (error) {
      return next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await categoryService.delete(this.getCategoryId(req), req.userId!);

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}
