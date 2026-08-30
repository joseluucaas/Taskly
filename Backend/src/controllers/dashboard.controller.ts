import type { NextFunction, Request, Response } from 'express';

import { DashboardService } from '../services/dashboard.service.js';
import { successResponse } from '../utils/apiResponse.js';

export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const dashboard = await this.dashboardService.getSummary(req.userId!);

      return res.status(200).json(successResponse(dashboard));
    } catch (error) {
      return next(error);
    }
  }
}
