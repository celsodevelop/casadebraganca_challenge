/* eslint-disable func-names */
import 'mocha';
import sinon from 'sinon';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import { Application } from 'express';
import { DataSource } from 'typeorm';

import { TestDataSouce } from './config/test-data-source';
import { runTestDatabase } from './config/run-test-db';

chai.use(chaiHttp);

describe('Mocha initializing test container...', function () {
  let orm: DataSource;
  let appProxied: Application;
  let killDb: () => Promise<void>;
  before(async function () {
    // You might need increase the time for first run to pull postgres image in background
    this.timeout(45 * 1000); // Time for load DB container.
    orm = TestDataSouce;
    const { startDataSourceThenServer, app, kill } = await runTestDatabase(orm);
    await startDataSourceThenServer();
    appProxied = app;
    killDb = kill;
    return orm.runMigrations();
  });
  after(async function () {
    await orm.destroy();
    sinon.restore();
    return killDb();
  });
  describe('Testing API routes... ...checks its database output', function () {
    describe('GET /cards', function () {
      it('should get 200 response with empty database', function (done) {
        chai
          .request(appProxied)
          .get('/cards')
          .then((response) => {
            expect(response).to.have.status(200);
            done();
          })
          .catch((error) => done(error));
      });
    });
  });
});
