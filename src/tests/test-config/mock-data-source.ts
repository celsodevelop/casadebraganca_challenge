import proxyquire from 'proxyquire';

import * as server from '../../app/app';
import { TestDataSource } from './test-data-source';

export const mockAppDataSource = async () => {
  const { app, ConnectedAppDataSource } = proxyquire
    .noCallThru()
    .load('../../app/app.ts', {
      '../db/config/data-source': {
        'AppDataSource': TestDataSource,
        '@global': true,
      },
    }) as typeof server;
  return {
    app,
    ConnectedTestDataSource: await ConnectedAppDataSource,
  };
};
