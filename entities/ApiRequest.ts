import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class ApiRequest {
  @PrimaryKey()
  id!: number;

  @Property()
  method!: string;

  @Property()
  url!: string;

  @Property({ type: 'json', nullable: true })
  headers?: Record<string, string>;

  @Property({ type: 'text', nullable: true })
  body?: string;

  @Property({ type: 'json', nullable: true })
  response?: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    data: any;
  };

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}