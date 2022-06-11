/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable func-names */
import 'mocha';
import sinon from 'sinon';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import { Application } from 'express';
import { DataSource } from 'typeorm';

import * as CardServices from '../service/Card.service';
import { TestDataSouce } from './config/test-data-source';
import { runTestDatabase } from './config/run-test-db';
import * as fakes from './utils/createFakes';
import { Card } from '../db/entity/Card.entity';

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
      describe('with empty database', function () {
        beforeEach(async function () {
          return orm.manager.clear(Card);
        });
        afterEach(async function () {
          return orm.manager.clear(Card);
        });
        it('should get 200 response', function (done) {
          chai
            .request(appProxied)
            .get('/cards')
            .then((response) => {
              expect(response).to.have.status(200);
              done();
            })
            .catch((error) => done(error));
        });
        it('should get no any cards', function (done) {
          chai
            .request(appProxied)
            .get('/cards')
            .then((response) => {
              expect((response.body as { cards: Card[] }).cards).is.empty;
              done();
            })
            .catch((error) => done(error));
        });
      });
      describe('with thirty cards at database', function () {
        before(async function () {
          return orm.manager.save(fakes.THIRTY_SAME_CARDS);
        });
        after(async function () {
          return orm.manager.clear(Card);
        });
        it('should get 200 response', function (done) {
          chai
            .request(appProxied)
            .get('/cards')
            .then((response) => {
              expect(response).to.have.status(200);
              done();
            })
            .catch((error) => done(error));
        });
        it('should get twenty cards instead of thirty', function (done) {
          chai
            .request(appProxied)
            .get('/cards')
            .then((response) => {
              expect((response.body as { cards: Card[] }).cards).has.lengthOf(20);
              done();
            })
            .catch((error) => done(error));
        });
        it('should get correct pagination info for 1st page', function (done) {
          chai
            .request(appProxied)
            .get('/cards')
            .then((response) => {
              expect(
                (response.body as Awaited<ReturnType<typeof CardServices['allSvc']>>)
                  .page_info,
              ).to.have.property('page_last_idx_item', 20);
              expect(
                (response.body as Awaited<ReturnType<typeof CardServices['allSvc']>>)
                  .page_info,
              ).to.have.property('last_page', 2);
              expect(
                (response.body as Awaited<ReturnType<typeof CardServices['allSvc']>>)
                  .page_info,
              ).to.have.property('total_cards', 30);
              expect(
                (response.body as Awaited<ReturnType<typeof CardServices['allSvc']>>)
                  .page_info,
              ).to.have.property('results_per_page', 20);
              done();
            })
            .catch((error) => done(error));
        });
        it('should get correct card info for last item at 1st page', function (done) {
          chai
            .request(appProxied)
            .get('/cards')
            .then((response) => {
              expect(
                (response.body as Awaited<ReturnType<typeof CardServices['allSvc']>>)
                  .cards[19],
              ).to.have.property('id', fakes.THIRTY_SAME_CARDS[19].id);
              done();
            })
            .catch((error) => done(error));
        });
        it('should get correct pagination info for 2nd page', function (done) {
          chai
            .request(appProxied)
            .get('/cards?page=2')
            .then((response) => {
              expect(
                (response.body as Awaited<ReturnType<typeof CardServices['allSvc']>>)
                  .page_info,
              ).has.ownProperty('page_last_idx_item');
              expect(
                (response.body as Awaited<ReturnType<typeof CardServices['allSvc']>>)
                  .page_info,
              ).to.have.property('page_last_idx_item', 30);
              done();
            })
            .catch((error) => done(error));
        });
        it('should get correct first card at ?page=2 items', function (done) {
          chai
            .request(appProxied)
            .get('/cards?page=2')
            .then((response) => {
              expect(
                (response.body as Awaited<ReturnType<typeof CardServices['allSvc']>>)
                  .cards[1],
              ).to.have.property('id', fakes.THIRTY_SAME_CARDS[21].id);
              done();
            })
            .catch((error) => done(error));
        });
      });
    });
  });
});
