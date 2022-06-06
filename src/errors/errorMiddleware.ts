// Este middleware de erro é apenas exemplo. Idealmente, pode ser ligado a uma tecnologia
// de rastreio de logs ou gerenciador de processos para maior controle em produção

import { ErrorRequestHandler } from 'express';
import AppError from './AppError';
import errorHandler from './errorHandler';
import errorMessages from './errorMessages.json';

// Precisamos de 4 variáveis no middleware de erro, logo desabilita regra linter

/* eslint-disable @typescript-eslint/no-unused-vars */
const errorMiddleware: ErrorRequestHandler = (
  err: AppError | Error,
  _req,
  res,
  _next,
) => {
  errorHandler(err, res);
};
/* eslint-enable @typescript-eslint/no-unused-vars */

// Estabilidade frente a erros não tratados, buscando manter o sistema no ar ou
// trazer mais informações sobre o erro para o stdout

process.on('unhandledRejection', (reason: AppError | Error) => {
  console.error(errorMessages.UNHANDLED_REJECTION, reason);
  errorHandler(reason);
});

process.on('uncaughtException', (error) => {
  console.error(errorMessages.UNCAUGHT_EXCEPTION, error);
  errorHandler(error);
});

export default errorMiddleware;
