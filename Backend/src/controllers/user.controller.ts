import type { NextFunction, Request, Response } from 'express';

import { changePasswordSchema, updatePreferencesSchema, updateProfileSchema } from '../schemas/user.schema.js';
import { UserService } from '../services/user.service.js';
import { successResponse } from '../utils/apiResponse.js';

const userService = new UserService();

export class UserController {
  async findMe(req: Request, res: Response, next: NextFunction) {
    try { return res.json(successResponse(await userService.findProfile(req.userId!))); } catch (error) { return next(error); }
  }

  async updateMe(req: Request, res: Response, next: NextFunction) {
    try { return res.json(successResponse(await userService.updateProfile(req.userId!, updateProfileSchema.parse(req.body)))); } catch (error) { return next(error); }
  }

  async updatePreferences(req: Request, res: Response, next: NextFunction) {
    try { return res.json(successResponse(await userService.updatePreferences(req.userId!, updatePreferencesSchema.parse(req.body)))); } catch (error) { return next(error); }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try { await userService.changePassword(req.userId!, changePasswordSchema.parse(req.body)); return res.status(204).send(); } catch (error) { return next(error); }
  }

  async logoutAll(req: Request, res: Response, next: NextFunction) {
    try { await userService.logoutAll(req.userId!); return res.status(204).send(); } catch (error) { return next(error); }
  }
}
