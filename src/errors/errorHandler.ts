import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import errorMessages from './errorMessages.json';
import AppError from './AppError';

const errorHandler = (errorObj: AppError | Error, res?: Response): Response | void => {
  if (res) {
    if (errorObj instanceof AppError) {
      // Verifica que o erro foi lançado pelo App

      console.log('AppError: ', errorObj);
      return res.status(errorObj.code).json({ message: errorObj.message });
    }
    // Caso erro interno no servidor express, evitar que
    // erros internos extrapolem o domínio do servidor

    console.error('Uncaught server error: ', errorObj); // Server log somente

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: errorMessages.INTERNAL_ERROR }); // Mensagem padrão
  }
  // Caso erro interno de sistema

  return console.error('Internal system error: ', errorObj);
};

export default errorHandler;
