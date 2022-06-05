import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Card } from '../db/entity/Card';

export class CardController {
  private cardRepository = AppDataSource.manager.getRepository(Card);

  async all(request: Request, _response: Response, _next: NextFunction) {
    return this.cardRepository.find();
  }

  async one(request: Request, _response: Response, _next: NextFunction) {
    if (typeof request.params.id === 'string') {
      return this.cardRepository.findOne({
        where: { id: request.params.id },
      });
    }
    return null;
  }

  async save(request: Request, _response: Response, _next: NextFunction) {
    return this.cardRepository.save(request.body);
  }

  async remove(request: Request, _response: Response, _next: NextFunction) {
    if (typeof request.params.id === 'number') {
      const userToRemove = await this.cardRepository.findOneBy({ id: request.params.id });
      if (userToRemove) {
        await this.cardRepository.remove(userToRemove);
      }
    }
  }
}
