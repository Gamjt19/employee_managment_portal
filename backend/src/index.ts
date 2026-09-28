import { createApp } from './app';
import { config } from './config/env';
import { initDatabase, isPostgresConnected } from './db/connection';

async function bootstrap() {
  const app = createApp();

  // Try initializing PostgreSQL database
  console.log('[EmployeeHub] Initializing backend services...');
  await initDatabase();

  const server = app.listen(config.port, () => {
    console.log(`--------------------------------------------------------`);
    console.log(`🚀 EmployeeHub Backend running on http://localhost:${config.port}`);
    console.log(`📡 Health Check: http://localhost:${config.port}/api/health`);
    console.log(`👥 Employees API: http://localhost:${config.port}/api/employees`);
    console.log(`📊 Dashboard API: http://localhost:${config.port}/api/dashboard/stats`);
    console.log(`💾 Database Mode: ${isPostgresConnected ? 'PostgreSQL (Connected)' : 'Fallback In-Memory Store (Active)'}`);
    console.log(`--------------------------------------------------------`);
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log('\n[EmployeeHub] Shutting down gracefully...');
    server.close(() => {
      console.log('[EmployeeHub] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

bootstrap().catch((err) => {
  console.error('[EmployeeHub] Fatal bootstrap error:', err);
  process.exit(1);
});
