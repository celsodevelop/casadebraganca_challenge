import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { AppDataSource } from './db/config/data-source';
import Routes from './routes';
import startServer from './bin/server';
import errorMiddleware from './middlewares/errorMiddleware';

// CREATE EXPRESS APP
export const app = express();
export async function startDataSourceThenServer(): Promise<void> {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      return await startDataSourceThenServer();
    }
    // SETUP
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use((_req: Request, res: Response, next: NextFunction) => {
      // Evita ataques de enumeração para extrair informações,
      // escondendo 'Express 4.18.1' do header das responses

      res.header('X-powered-by', 'Sweat and hard work.');
      next();
    });

    // REGISTER ROUTES
    app.use('/cards', Routes.card);

    // ERROR MIDDLEWARE

    app.use(errorMiddleware);

    // START EXPRESS SERVER
    return startServer(app);
  } catch (error) {
    if (!AppDataSource.isInitialized) {
      console.error('Error starting data source: ', error);
      await AppDataSource.initialize();
      return startDataSourceThenServer();
    }
    return console.error('Error with started data source: ', error);
  }
}

if (process.env.NODE_ENV !== 'test') {
  startDataSourceThenServer().catch((err) => console.error(err));
}
