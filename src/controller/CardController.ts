import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import AppError from '../errors/AppError';
import errorMessages from '../errors/errorMessages.json';
import { CardRepository } from '../model/Card.repository';
import { checkUUIDv4 } from '../utils/uuidCheck';

export class CardController {
  private cardRepository = CardRepository;

  async all(request: Request, response: Response, next: NextFunction) {
    let cardsPage;
    const { page: reqPage = 0 } = request.query;
    try {
      if (typeof reqPage === 'string') {
        const page = parseInt(reqPage, 10) - 1;
        cardsPage = await this.cardRepository.findAllCards(page);
      } else {
        cardsPage = await this.cardRepository.findAllCards();
      }
      response.status(StatusCodes.OK);
      return cardsPage;
    } catch (error) {
      return next(error);
    }
  }

  async one(request: Request, response: Response, next: NextFunction) {
    try {
      if (!checkUUIDv4(request.params.id)) {
        throw new AppError(StatusCodes.BAD_REQUEST, errorMessages.INVALID_CARD);
      } else {
        response.status(StatusCodes.OK);
        return await this.cardRepository.findOneCard(request.params.id);
      }
    } catch (error) {
      return next(error);
    }
  }

  // async save(request: Request, _response: Response, _next: NextFunction) {
  //   return this.cardRepository.save(request.body);
  // }

  // async remove(request: Request, _response: Response, _next: NextFunction) {
  //   if (typeof request.params.id === 'number') {
  //     const userToRemove = await this.cardRepository.findOneBy(
  // { id: request.params.id });
  //     if (userToRemove) {
  //       await this.cardRepository.remove(userToRemove);
  //     }
  //   }
  // }
}
