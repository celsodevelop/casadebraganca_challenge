/* eslint-disable import/no-extraneous-dependencies */
import sinon from 'sinon';
import pgSetup from '@databases/pg-test/jest/globalSetup';
import pgTeardown from '@databases/pg-test/jest/globalTeardown';
import proxyquire from 'proxyquire';

import { DataSource } from 'typeorm';

import * as server from '../..';

export async function runTestDatabase(orm: DataSource) {
  await pgSetup({
    externalPort: parseInt(process.env.PG_TEST_PORT || '5433', 10),
    debug: false,
    detached: true,
    environment: {
      POSTGRES_PORT: process.env.PG_TEST_PORT || '5433',
      PGPORT: process.env.PG_TEST_PORT || '5433',
    },
  });
  const ormStub = sinon.stub().returns(orm);
  const { startDataSourceThenServer, app } = proxyquire.noCallThru()('../../index.ts', {
    './db/config/data-source': {
      AppDataSource: ormStub() as DataSource,
    },
  }) as typeof server;
  return { app, startDataSourceThenServer, kill: pgTeardown };
}
