import { StatusCodes } from 'http-status-codes';

type IAppError = Error & {
  code: number;
};

// Classe para erros externos personalizados com contenção da
// stack trace para evitar vazamento de infos da infra do sistema

class AppError extends Error implements IAppError {
  code: number;

  constructor(code: number, message: string) {
    super(message);
    this.code = code || StatusCodes.INTERNAL_SERVER_ERROR;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
