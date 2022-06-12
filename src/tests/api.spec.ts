import 'mocha';
import sinon from 'sinon';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import { Application } from 'express';
import { DataSource } from 'typeorm';

import { mockAppDataSource } from './test-config/mock-data-source';
import * as CardServices from '../service/Card.service';
import { runTestDatabase } from './test-config/run-test-db';
import * as fakes from './test-utils/createFakes';

chai.use(chaiHttp);

// You might need increase the timeout below for first
// test environment run to allow pull postgres image
const CONTAINER_TIMEOUT_S = 60;
const CONTAINER_TIMEOUT_MS = CONTAINER_TIMEOUT_S * 1000; // miliseconds

const URL_CARD_PAGE_2 = '/cards?page=2';
const URL_CARD_PAGE = '/cards';

const GET_ALL_RESPONSE_CARDS = 'cards';
const GET_ALL_RESPONSE_PAGE_INFO = 'page_info';
const PAGE_INFO_PAGE_LAST_IDX_ITEM = 'page_last_idx_item';
const PAGE_INFO_LAST_PAGE = 'last_page';
const PAGE_INFO_TOTAL_CARDS = 'total_cards';
const PAGE_INFO_RESULTS_PER_PAGE = 'results_per_page';

describe('Casa de Braganca Challenge - Integration Test', function () {
  let appProxied: Application;
  let TestDataSource: DataSource;
  let killDb: () => Promise<void>;
  before('Initializing db test container and api.', async function () {
    this.timeout(CONTAINER_TIMEOUT_MS);
    const { killTestDb } = await runTestDatabase(CONTAINER_TIMEOUT_S);
    const { app, ConnectedTestDataSource } = await mockAppDataSource();
    appProxied = app;
    TestDataSource = ConnectedTestDataSource;
    killDb = killTestDb;
    return appProxied;
  });
  after('Cleaning-up the things, stopping container.', async function () {
    this.timeout(60 * 1000);
    await TestDataSource.destroy();
    sinon.restore();
    await killDb();
  });
  describe('Test Environment OK. Running tests...', function () {
    describe('HTTP knocking API routes then check the database output', function () {
      describe('GET /cards', function () {
        describe('When empty database', function () {
          beforeEach('Ensure db/card have been truncated', async function () {
            return TestDataSource.manager.clear('Card');
          });
          after('Ensure db will be truncated after test', async function () {
            return TestDataSource.manager.clear('Card');
          });

          it('should get 200 response', async function () {
            const response = await chai.request(appProxied).get(URL_CARD_PAGE);
            expect(response).to.have.status(200);
          });
          it('should get object in response', async function () {
            const response = await chai.request(appProxied).get(URL_CARD_PAGE);
            expect(response).to.be.an('object');
          });
          it(`should get ${GET_ALL_RESPONSE_CARDS} at res body`, async function () {
            const response = (await chai
              .request(appProxied)
              .get(URL_CARD_PAGE)) as unknown as ReturnType<ChaiHttp.Agent['get']> & {
              body: Awaited<ReturnType<typeof CardServices['allSvc']>>;
            };
            expect(response.body).to.have.a.property(GET_ALL_RESPONSE_CARDS);
          });
          it(`${GET_ALL_RESPONSE_CARDS} should have to be an array`, async function () {
            const response = (await chai
              .request(appProxied)
              .get(URL_CARD_PAGE)) as unknown as ReturnType<ChaiHttp.Agent['get']> & {
              body: Awaited<ReturnType<typeof CardServices['allSvc']>>;
            };
            expect(response.body.cards).to.be.an('array');
          });
          it('should get no any cards', async function () {
            const response = (await chai
              .request(appProxied)
              .get(URL_CARD_PAGE)) as unknown as ReturnType<ChaiHttp.Agent['get']> & {
              body: Awaited<ReturnType<typeof CardServices['allSvc']>>;
            };
            expect(response.body.cards).is.empty;
          });
          it(`should get ${GET_ALL_RESPONSE_PAGE_INFO} at res body`, async function () {
            const response = (await chai
              .request(appProxied)
              .get(URL_CARD_PAGE)) as unknown as ReturnType<ChaiHttp.Agent['get']> & {
              body: Awaited<ReturnType<typeof CardServices['allSvc']>>;
            };
            expect(response.body).to.have.a.property(GET_ALL_RESPONSE_PAGE_INFO);
          });
          it(`${GET_ALL_RESPONSE_PAGE_INFO} should have to be an obj`, async function () {
            const response = (await chai
              .request(appProxied)
              .get(URL_CARD_PAGE)) as unknown as ReturnType<ChaiHttp.Agent['get']> & {
              body: Awaited<ReturnType<typeof CardServices['allSvc']>>;
            };
            expect(response.body.page_info).to.be.an('object');
          });
          it('should get correct pagination info for single page', async function () {
            const response = (await chai
              .request(appProxied)
              .get(URL_CARD_PAGE)) as unknown as ReturnType<ChaiHttp.Agent['get']> & {
              body: Awaited<ReturnType<typeof CardServices['allSvc']>>;
            };

            expect(response.body.page_info).to.have.property(
              PAGE_INFO_PAGE_LAST_IDX_ITEM,
              0,
            );
            expect(response.body.page_info).to.have.property(PAGE_INFO_LAST_PAGE, 1);
            expect(response.body.page_info).to.have.property(PAGE_INFO_TOTAL_CARDS, 0);
            expect(response.body.page_info).to.have.property(
              PAGE_INFO_RESULTS_PER_PAGE,
              20,
            );
          });
        });

        describe('When having thirty cards at database', function () {
          before('Seeding db with thirty cards', async function () {
            return TestDataSource.manager.save(fakes.THIRTY_SAME_CARDS);
          });
          after('Ensure db will be truncated after test', async function () {
            return TestDataSource.manager.clear('Card');
          });

          it('should get 200 response', async function () {
            const response = await chai.request(appProxied).get(URL_CARD_PAGE);
            expect(response).to.have.status(200);
          });
          it('should get object in response', async function () {
            const response = await chai.request(appProxied).get(URL_CARD_PAGE);
            expect(response).to.be.an('object');
          });
          it(`should get key ${GET_ALL_RESPONSE_CARDS} at res body`, async function () {
            const response = (await chai
              .request(appProxied)
              .get(URL_CARD_PAGE)) as unknown as ReturnType<ChaiHttp.Agent['get']> & {
              body: Awaited<ReturnType<typeof CardServices['allSvc']>>;
            };
            expect(response.body).to.have.a.property(GET_ALL_RESPONSE_CARDS);
          });
          it(`${GET_ALL_RESPONSE_CARDS} should have to be an array`, async function () {
            const response = (await chai
              .request(appProxied)
              .get(URL_CARD_PAGE)) as unknown as ReturnType<ChaiHttp.Agent['get']> & {
              body: Awaited<ReturnType<typeof CardServices['allSvc']>>;
            };
            expect(response.body.cards).to.be.an('array');
          });
          it('should get twenty cards instead of thirty', async function () {
            const response = (await chai
              .request(appProxied)
              .get(URL_CARD_PAGE)) as unknown as ReturnType<ChaiHttp.Agent['get']> & {
              body: Awaited<ReturnType<typeof CardServices['allSvc']>>;
            };
            expect(response.body.cards).has.lengthOf(20);
          });
          it(`should get ${GET_ALL_RESPONSE_PAGE_INFO} at res body`, async function () {
            const response = (await chai
              .request(appProxied)
              .get(URL_CARD_PAGE)) as unknown as ReturnType<ChaiHttp.Agent['get']> & {
              body: Awaited<ReturnType<typeof CardServices['allSvc']>>;
            };
            expect(response.body).to.have.a.property(GET_ALL_RESPONSE_PAGE_INFO);
          });
          it(`${GET_ALL_RESPONSE_PAGE_INFO} should have to be an obj`, async function () {
            const response = (await chai
              .request(appProxied)
              .get(URL_CARD_PAGE)) as unknown as ReturnType<ChaiHttp.Agent['get']> & {
              body: Awaited<ReturnType<typeof CardServices['allSvc']>>;
            };
            expect(response.body.page_info).to.be.an('object');
          });
          it('should get correct pagination info for 1st page', async function () {
            const response = (await chai
              .request(appProxied)
              .get(URL_CARD_PAGE)) as unknown as ReturnType<ChaiHttp.Agent['get']> & {
              body: Awaited<ReturnType<typeof CardServices['allSvc']>>;
            };

            expect(response.body.page_info).to.have.property(
              PAGE_INFO_PAGE_LAST_IDX_ITEM,
              20,
            );
            expect(response.body.page_info).to.have.property(PAGE_INFO_LAST_PAGE, 2);
            expect(response.body.page_info).to.have.property(PAGE_INFO_TOTAL_CARDS, 30);
            expect(response.body.page_info).to.have.property(
              PAGE_INFO_RESULTS_PER_PAGE,
              20,
            );
          });
          it('should get correct first card at 1st page', async function () {
            const response = (await chai
              .request(appProxied)
              .get(URL_CARD_PAGE)) as unknown as ReturnType<ChaiHttp.Agent['get']> & {
              body: Awaited<ReturnType<typeof CardServices['allSvc']>>;
            };
            expect(response.body.cards[0]).to.have.property(
              'id',
              fakes.THIRTY_SAME_CARDS[0].id,
            );
          });
          it('should get correct last card info for 1st page', async function () {
            const response = (await chai
              .request(appProxied)
              .get(URL_CARD_PAGE)) as unknown as ReturnType<ChaiHttp.Agent['get']> & {
              body: Awaited<ReturnType<typeof CardServices['allSvc']>>;
            };
            expect(response.body.cards[19]).to.have.property(
              'id',
              fakes.THIRTY_SAME_CARDS[19].id,
            );
          });
          it('should get correct pagination info for 2nd page', async function () {
            const response = (await chai
              .request(appProxied)
              .get(URL_CARD_PAGE_2)) as unknown as ReturnType<ChaiHttp.Agent['get']> & {
              body: Awaited<ReturnType<typeof CardServices['allSvc']>>;
            };
            expect(response.body.page_info).to.have.property(
              PAGE_INFO_PAGE_LAST_IDX_ITEM,
              30,
            );
          });
          it('should get correct first card at 2nd page', async function () {
            const response = (await chai
              .request(appProxied)
              .get(URL_CARD_PAGE_2)) as unknown as ReturnType<ChaiHttp.Agent['get']> & {
              body: Awaited<ReturnType<typeof CardServices['allSvc']>>;
            };
            expect(response.body.cards[0]).to.have.property(
              'id',
              fakes.THIRTY_SAME_CARDS[20].id,
            );
          });
          it('should get correct last card at 2nd page', async function () {
            const response = (await chai
              .request(appProxied)
              .get(URL_CARD_PAGE_2)) as unknown as ReturnType<ChaiHttp.Agent['get']> & {
              body: Awaited<ReturnType<typeof CardServices['allSvc']>>;
            };
            expect(response.body.cards[9]).to.have.property(
              'id',
              fakes.THIRTY_SAME_CARDS[29].id,
            );
          });
        });
      });
    });
  });
});
