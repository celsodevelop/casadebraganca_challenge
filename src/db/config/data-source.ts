import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'cdb_dev',
  password: 'cdb_Dev@User',
  database: 'cdbrag-db',
  synchronize: false,
  logging: false,
  entities: ['src/db/entity/**/*.ts'],
  migrations: ['src/db/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
});
