import bodyParser from 'body-parser';
import express, { NextFunction, Request, Response, Application } from 'express';
import { AppDataSource } from './config/data-source';
import { Routes } from './routes';
import startServer from './bin/server';
import errorMiddleware from './errors/errorMiddleware';

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
    Routes.forEach((route) => {
      (app as Application)[route.method as 'get' | 'put' | 'delete'](
        route.route,
        (req: Request, res: Response, next: NextFunction) => {
          // eslint-disable-next-line new-cap
          const result = new route.controller()[route.action as 'all' | 'one'](
            req,
            res,
            next,
          );
          if (result instanceof Promise) {
            result
              .then((resolved) =>
                resolved !== null && resolved !== undefined
                  ? res.send(resolved)
                  : undefined,
              )
              .catch((err) => console.log('Error at routes register: ', err));
          } else if (result !== null && result !== undefined) {
            res.json(result);
          }
        },
      );
    });

    // ERROR MIDDLEWARE

    app.use(errorMiddleware);

    // START EXPRESS SERVER
    startServer(app);
  })
  .catch((err) => console.log('Error at database connection: ', err));
