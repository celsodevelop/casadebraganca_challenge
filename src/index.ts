import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import startServer from './bin/server';

const app = express();

// SETUP

app.use((_req: Request, res: Response, next: NextFunction) => {
  // Evita ataques de enumeração para extrair informações,
  // escondendo 'Express 4.18.1' do header das responses

  res.header('X-powered-by', 'Sweat and hard work.');
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ROUTES

app.use((_req, res) => {
  return res.status(200).end();
});

// START LISTEN SERVER

startServer(app);
