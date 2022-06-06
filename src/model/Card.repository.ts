import { StatusCodes } from 'http-status-codes';
import { AppDataSource } from '../config/data-source';
import { Card } from '../db/entity/Card';
import AppError from '../errors/AppError';
import errorMessages from '../errors/errorMessages.json';

const RESULTS_PER_PAGE = 20;

export const CardRepository = AppDataSource.getRepository(Card).extend({
  async findAllCards(page = 0) {
    const [data, total] = await this.findAndCount({
      take: RESULTS_PER_PAGE,
      skip: RESULTS_PER_PAGE * page,
    });
    const totalPages = Math.floor(total / RESULTS_PER_PAGE);
    if (page > totalPages && typeof errorMessages.INVALID_PAGE === 'string') {
      throw new AppError(StatusCodes.BAD_REQUEST, errorMessages.INVALID_PAGE);
    }
    return { data, last_page: totalPages + 1, this_page: page + 1 };
  },
  async findOneCard(id: string) {
    const card = await this.findOne({
      where: { id },
    });
    if (!card) {
      throw new AppError(StatusCodes.BAD_REQUEST, errorMessages.INVALID_CARD);
    }
    return card;
  },
});
