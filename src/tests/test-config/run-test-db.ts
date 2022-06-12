import pgSetup from '@databases/pg-test/jest/globalSetup';
import pgTeardown from '@databases/pg-test/jest/globalTeardown';

export async function runTestDatabase(timeout?: number) {
  await pgSetup({
    externalPort: parseInt(process.env.PG_TEST_PORT || '5433', 10),
    debug: false,
    connectTimeoutSeconds: timeout || 20,
    detached: true,
    environment: {
      POSTGRES_PORT: process.env.PG_TEST_PORT || '5433',
      PGPORT: process.env.PG_TEST_PORT || '5433',
    },
  });

  return { killTestDb: pgTeardown };
}
