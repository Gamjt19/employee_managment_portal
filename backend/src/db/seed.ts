import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { config } from '../config/env';

async function runSeed() {
  console.log('[DB Seed] Seeding sample data into PostgreSQL...');
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
    const seedSql = fs.readFileSync(path.resolve(__dirname, 'seed.sql'), 'utf8');
    await pool.query(seedSql);
    console.log('[DB Seed] Sample employee records successfully seeded!');
  } catch (err: any) {
    console.error('[DB Seed] Error seeding data:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runSeed();
