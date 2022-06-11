import { faker } from '@faker-js/faker/locale/pt_BR';
import { Card } from '../../db/entity/Card.entity';

export const THIRTY_SAME_CARDS: Card[] = [];

export function createRandomCard(seed?: number): Card {
  faker.seed(seed);
  const newCard = new Card();
  return Object.assign(newCard, {
    id: faker.datatype.uuid(),
    name: faker.name.firstName(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.phoneNumber(),
    photo: faker.image.avatar(),
    company: faker.company.companyName(),
    jobTitle: faker.name.jobTitle(),
  });
}

Array.from({ length: 30 }).forEach((_num, idx) => {
  THIRTY_SAME_CARDS.push(createRandomCard(idx));
});
