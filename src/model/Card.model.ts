import { StatusCodes } from 'http-status-codes';

import { AppDataSource } from '../db/config/data-source';
import { Card } from '../db/entity/Card.entity';
import AppError from '../errors/AppError';
import errorMessages from '../errors/errorMessages.json';

const RESULTS_PER_PAGE = 20;

export const CardModel = AppDataSource.getRepository<Card>('Card').extend({
  async findAllCards(page = 0) {
    const fromIdxItem = RESULTS_PER_PAGE * page;
    const [cards, total] = await this.findAndCount({
      take: RESULTS_PER_PAGE,
      skip: fromIdxItem,
    });
    const totalPages = Math.floor(total / RESULTS_PER_PAGE);

    if (page > totalPages) {
      throw new AppError(StatusCodes.BAD_REQUEST, errorMessages.INVALID_PAGE);
    }
    const pageInfo = {
      last_page: totalPages + 1,
      page_last_idx_item: Math.min(fromIdxItem + RESULTS_PER_PAGE, total),
      results_per_page: RESULTS_PER_PAGE,
      total_cards: total,
    };

    return { cards, page_info: pageInfo };
  },
  async findOneCard(id: string) {
    const card = await this.findOne({
      where: { id },
    });
    if (!card) {
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
  async editCard(card: Card, newInfo: Partial<Card>) {
    return this.update(card.id, newInfo);
  },
  async removeCard(card: Card) {
    return this.remove(card);
  },
});
