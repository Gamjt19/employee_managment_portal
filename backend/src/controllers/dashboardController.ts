import { Request, Response, NextFunction } from 'express';
import { employeeRepository } from '../repositories/employeeRepository';

export class DashboardController {
  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await employeeRepository.getDashboardStats();
      res.status(200).json({
        status: 'success',
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
