import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load .env variables locally if needed
dotenv.config();

export default defineConfig({
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.SUPABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres',
  },
  verbose: true,
  strict: true,
});
