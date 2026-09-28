import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import healthRoutes from './routes/healthRoutes';
import employeeRoutes from './routes/employeeRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { config } from './config/env';

export function createApp(): express.Application {
  const app = express();

  // Basic Middlewares
  app.use(
    cors({
      origin: '*', // Allow frontend access
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  if (config.nodeEnv !== 'test') {
    app.use(morgan('dev'));
  }

  // Root welcome route
  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to EmployeeHub REST API',
      health: '/api/health',
      employees: '/api/employees',
      dashboard: '/api/dashboard/stats',
    });
  });

  // API Routes
  app.use('/api/health', healthRoutes);
  app.use('/api/employees', employeeRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
