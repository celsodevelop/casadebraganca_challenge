/* eslint-disable prettier/prettier */
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Card } from '../../db/entity/Card.entity';

export const TestDataSource = new DataSource({
  type: 'postgres',
  host: process.env.PG_TEST_CONTAINER_NAME || 'postgres',
  port: parseInt(process.env.PG_TEST_PORT || '5432', 10),
  username: process.env.PG_TEST_USER || 'test-user',
  database: process.env.PG_TEST_DB || 'test-db',
  synchronize: false,
  logging: false,
  entities: [Card],
  migrations: ['src/db/migration/**/*.ts'],
  subscribers: ['src/db/subscriber/**/*.ts'],
});
