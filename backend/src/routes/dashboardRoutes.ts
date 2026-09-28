import { Router } from 'express';
import { dashboardController } from '../controllers/dashboardController';

const router = Router();

// GET /api/dashboard/stats - get dashboard metrics, counts, and recent employees
router.get('/stats', (req, res, next) => dashboardController.getStats(req, res, next));

export default router;
