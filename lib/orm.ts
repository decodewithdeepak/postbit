import { MikroORM, RequestContext } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import config from './mikro-orm.config';

let orm: MikroORM<PostgreSqlDriver>;

export async function getORM() {
  if (!orm) {
    orm = await MikroORM.init(config);
  }
  return orm;
}

export async function getEM() {
  const orm = await getORM();
  return RequestContext.getEntityManager() || orm.em.fork();
}