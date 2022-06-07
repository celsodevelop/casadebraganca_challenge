import { Card } from '../db/entity/Card.entity';

export const parseCardToResponse = (card: Card) => {
  const {
    phoneNumber: phNumber,
    jobTitle: jbTitle,
    ...createdCardWithoutPascalCaseKeys
  } = card;

  return {
    ...createdCardWithoutPascalCaseKeys,
    phone_number: phNumber,
    job_title: jbTitle,
  };
};
