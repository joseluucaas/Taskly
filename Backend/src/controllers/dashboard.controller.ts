import type { NextFunction, Request, Response } from 'express';

import { DashboardService } from '../services/dashboard.service.js';
import { successResponse } from '../utils/apiResponse.js';


const dashboardService = new DashboardService();


export class DashboardController {
  async getSummary(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const dashboard = await dashboardService.getSummary(req.userId!);

      return res.status(200).json(successResponse(dashboard));
    } catch (error) {
      return next(error);
    }
  }
}
