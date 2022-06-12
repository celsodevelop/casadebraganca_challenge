import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { AppDataSource } from '../db/config/data-source';
import { Routes } from '../routes';
import startServer from '../bin/server';
import errorMiddleware from '../middlewares/errorMiddleware';
import errorHandler from '../errors/errorHandler';
import AppError from '../errors/AppError';

// INITIALIZE TYPEORM CONNECTION
export const ConnectedAppDataSource = AppDataSource.initialize()
  .then(() => {
    console.log('DataSource initialized');
    return AppDataSource;
  })
  .catch((error: Error) => {
    if (!AppDataSource.isInitialized) {
      errorHandler(new AppError(500, `Error starting data source: ${error.message}`));
      return AppDataSource;
    }
    errorHandler(
      new AppError(
        500,
        ` DB is connected, but we have an Error starting data source: ${error.message}`,
      ),
    );
    return AppDataSource;
  });

// CREATE EXPRESS APP
export const app = express();
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
app.use('/cards', Routes.CardRouter);

// ERROR MIDDLEWARE

app.use(errorMiddleware);

// START EXPRESS SERVER
startServer(app);
