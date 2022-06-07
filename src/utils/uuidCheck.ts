import { StatusCodes } from 'http-status-codes';
import { validate, version } from 'uuid';
import errorMessages from '../errors/errorMessages.json';
import AppError from '../errors/AppError';

const error = new AppError(StatusCodes.BAD_REQUEST, errorMessages.INVALID_CARD_ID);
export const checkUUIDv4 = (uuid: string) => {
  if (typeof uuid !== 'string') {
    throw error;
  }
  const isValid = validate(uuid) && version(uuid) === 4;
  if (!isValid) throw error;
  return isValid;
};
