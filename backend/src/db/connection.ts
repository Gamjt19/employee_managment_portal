import { Pool, PoolConfig } from 'pg';
import fs from 'fs';
import path from 'path';
import { config } from '../config/env';

let pool: Pool | null = null;
export let isPostgresConnected = false;

const poolConfig: PoolConfig = config.db.connectionString
  ? {
      connectionString: config.db.connectionString,
      ssl: config.db.ssl,
    }
  : {
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      ssl: config.db.ssl,
      connectionTimeoutMillis: 3000,
    };

export function getPool(): Pool | null {
  return pool;
}

export async function initDatabase(): Promise<boolean> {
  try {
    pool = new Pool(poolConfig);

    // Test connection with a 3 second timeout
    const client = await pool.connect();
    const result = await client.query('SELECT current_database(), current_user, version()');
    client.release();

    isPostgresConnected = true;
    console.log(`[PostgreSQL] Connected successfully to database: ${result.rows[0].current_database}`);

    // Run schema.sql to ensure table exists
    const schemaPath = path.resolve(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(schemaSql);
      console.log('[PostgreSQL] Database schema verified and updated.');

      // Check if employees table has rows; if not, seed initial data
      const countRes = await pool.query('SELECT COUNT(*) FROM employees');
      if (parseInt(countRes.rows[0].count, 10) === 0) {
        console.log('[PostgreSQL] No employees found. Seeding initial records...');
        const seedPath = path.resolve(__dirname, 'seed.sql');
        if (fs.existsSync(seedPath)) {
          const seedSql = fs.readFileSync(seedPath, 'utf8');
          await pool.query(seedSql);
          console.log('[PostgreSQL] Seed records inserted successfully.');
        }
      }
    }

    return true;
  } catch (error: any) {
    isPostgresConnected = false;
    console.warn(`[PostgreSQL] Connection warning: ${error.message || error}`);
    if (config.useMockFallback) {
      console.log('[Database] Active fallback mode: Serving data via in-memory store.');
      console.log('[Database] To connect to your PostgreSQL database, ensure PostgreSQL is running and update backend/.env credentials.');
    } else {
      console.error('[Database] Failed to connect and fallback is disabled.');
    }
    return false;
  }
}
