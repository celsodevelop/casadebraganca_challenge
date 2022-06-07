import { StatusCodes } from 'http-status-codes';
import { AppDataSource } from '../db/config/data-source';
import { Card } from '../db/entity/Card.entity';
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
      console.log('erro no model: ', card);
      throw new AppError(StatusCodes.BAD_REQUEST, errorMessages.INVALID_CARD_ID);
    }
    return card;
  },
  async saveCard(newCard: Card) {
    if (!newCard) {
      throw new AppError(StatusCodes.BAD_REQUEST, errorMessages.INVALID_CARD);
    }
    const card = new Card();
    card.name = newCard.name;
    card.email = newCard.email;
    card.company = newCard.company;
    card.phoneNumber = newCard.phoneNumber;
    card.jobTitle = newCard.jobTitle;
    card.photo = newCard?.photo;
    return this.save(card);
  },
  async removeCard(card: Card) {
    return this.remove(card);
  },
});
