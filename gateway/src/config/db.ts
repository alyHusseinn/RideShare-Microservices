import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import config from './env'

const pool = new Pool({
  host: config.DB_HOST,
  port: Number(config.DB_PORT),
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
});

export const db = drizzle(pool);