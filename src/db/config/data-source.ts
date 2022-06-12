import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Card } from '../entity/Card.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOSTNAME || 'postgres',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER || 'user',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: process.env.POSTGRES_DB || 'db',
  synchronize: false,
  cache: true,
  logging: false,
  entities: [Card],
  migrations: ['src/db/migration/**/*.ts'],
  subscribers: ['src/db/subscriber/**/*.ts'],
});
