import config from './src/config/env'
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/models/*.ts', // Adjust the path to match your schema files
  out: './src/migrations', // Path where your migration files will be saved
  dbCredentials: {
    url: `postgresql://${config.DB_USER}:${config.DB_PASSWORD}@${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`,
  }
});