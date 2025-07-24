import { defineConfig } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { ApiRequest } from '@/entities/ApiRequest';

export default defineConfig({
  driver: PostgreSqlDriver,
  clientUrl: process.env.DATABASE_URL,
  entities: [ApiRequest],
  debug: process.env.NODE_ENV !== 'production',
  migrations: {
    path: './migrations',
    pathTs: './migrations',
  },
});