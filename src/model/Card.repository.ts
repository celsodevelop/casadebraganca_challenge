import { AppDataSource } from '../config/data-source';
import { Card } from '../db/entity/Card';

const RESULTS_PER_PAGE = 20;

export const CardRepository = AppDataSource.getRepository(Card).extend({
  async findAllCards(page = 0) {
    const [data, total] = await this.findAndCount({
      take: RESULTS_PER_PAGE,
      skip: RESULTS_PER_PAGE * page,
    });
    const totalPages = Math.floor(total / RESULTS_PER_PAGE);
    // if (page > totalPages) throw Error('Invalid page.');
    return { data, last_page: totalPages + 1, this_page: page + 1 };
  },
});
