import bodyParser from 'body-parser';
import express, { NextFunction, Request, Response, Application } from 'express';
import { AppDataSource } from './db/config/data-source';
import Routes from './routes';
import startServer from './bin/server';
import errorMiddleware from './middlewares/errorMiddleware';

export default AppDataSource.initialize()
  .then(() => {
    // CREATE EXPRESS APP
    const app = express();

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
    app.use('/cards', Routes.card)

    // ERROR MIDDLEWARE

    app.use(errorMiddleware);

    // START EXPRESS SERVER
    startServer(app);
  })
  .catch((err) => console.log('Error at database connection: ', err));
