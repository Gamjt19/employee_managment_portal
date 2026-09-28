import { Router, Request, Response } from 'express';
import { isPostgresConnected } from '../db/connection';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'EmployeeHub REST API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: {
      status: isPostgresConnected ? 'connected' : 'fallback-in-memory',
      type: isPostgresConnected ? 'PostgreSQL' : 'MockStore',
    },
    uptime: process.uptime(),
  });
});

export default router;
