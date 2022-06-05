import { NextFunction, Request, Response } from 'express';
import { CardRepository } from '../model/Card.repository';

export class CardController {
  private cardRepository = CardRepository;

  async all(request: Request, _response: Response, _next: NextFunction) {
    let page;
    const { page: reqPage = 0 } = request.query;
    if (typeof reqPage === 'string') {
      page = parseInt(reqPage, 10) - 1;
    } else {
      return this.cardRepository.findAllCards();
    }
    return this.cardRepository.findAllCards(page);
  }

  // async one(request: Request, _response: Response, _next: NextFunction) {
  //   if (typeof request.params.id === 'string') {
  //     return this.cardRepository.findOne({
  //       where: { id: request.params.id },
  //     });
  //   }
  //   return null;
  // }

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
