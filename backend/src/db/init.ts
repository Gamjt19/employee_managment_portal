import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { config } from '../config/env';

async function runInit() {
  console.log('[DB Init] Initializing PostgreSQL database schema...');
  const pool = new Pool(
    config.db.connectionString
      ? { connectionString: config.db.connectionString }
      : {
          host: config.db.host,
          port: config.db.port,
          user: config.db.user,
          password: config.db.password,
          database: config.db.database,
          ssl: config.db.ssl,
        }
  );

  try {
    const schemaSql = fs.readFileSync(path.resolve(__dirname, 'schema.sql'), 'utf8');
    await pool.query(schemaSql);
    console.log('[DB Init] Schema successfully applied!');
  } catch (err: any) {
    console.error('[DB Init] Error applying schema:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runInit();
