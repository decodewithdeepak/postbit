// mikro-orm.config.ts
import { defineConfig } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { ApiRequest } from './entities/ApiRequest';
import * as dotenv from 'dotenv';

dotenv.config(); // Load .env file before using env vars

export default defineConfig({
  driver: PostgreSqlDriver,
  clientUrl: process.env.DATABASE_URL,
  entities: [ApiRequest],
  debug: process.env.NODE_ENV !== 'production',
  migrations: {
    path: './migrations', // required for CLI
    pathTs: './migrations', // required for TypeScript
  },
  // Neon/PostgreSQL SSL config
  driverOptions: {
    connection: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
});
