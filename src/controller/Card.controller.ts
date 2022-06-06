import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Card } from '../db/entity/Card.entity';
import AppError from '../errors/AppError';
import errorMessages from '../errors/errorMessages.json';
import * as CardServices from '../service/Card.services';
import { checkUUIDv4 } from '../utils/uuidCheck';

export const all = async (request: Request, response: Response, next: NextFunction) => {
  let cardsPage;
  const { page: reqPage = 0 } = request.query;
  try {
    if (typeof reqPage === 'string') {
      const parsedPage = parseInt(reqPage, 10) - 1;
      cardsPage = await CardServices.allSvc(parsedPage);
    } else {
      cardsPage = await CardServices.allSvc(Number(reqPage));
    }
    response.status(StatusCodes.OK);
    return response.json(cardsPage);
  } catch (error) {
    return next(error);
  }
};

export const one = async (request: Request, response: Response, next: NextFunction) => {
  try {
    if (!checkUUIDv4(request.params.id)) {
      throw new AppError(StatusCodes.BAD_REQUEST, errorMessages.INVALID_CARD_ID);
    } else {
      const selectedCard = await CardServices.oneSvc(request.params.id);
      response.status(StatusCodes.OK);
      return response.json(selectedCard);
    }
  } catch (error) {
    return next(error);
  }
};

export const save = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { name, company, email, jobTitle, phoneNumber } = request.body;
    const newCard = {
      name, company, email, jobTitle, phoneNumber, photo: request.file?.path
    } as Card;
    const createdCard = await CardServices.saveSvc(newCard);
    response.status(StatusCodes.ACCEPTED)
    return response.json(createdCard)
  } catch (error) {
    return next(error);
  }
};

// async remove(request: Request, _response: Response, _next: NextFunction) {
//   if (typeof request.params.id === 'number') {
//     const userToRemove = await CardRepository.findOneBy(
// { id: request.params.id });
//     if (userToRemove) {
//       await CardRepository.remove(userToRemove);
//     }
//   }
// }
