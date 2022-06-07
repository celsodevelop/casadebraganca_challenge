import { Card } from '../db/entity/Card.entity';
import { CardRepository } from '../model/Card.repository';

export const allSvc = async (page: number) => {
  return CardRepository.findAllCards(page);
};

export const oneSvc = async (cardId: string) => {
  return CardRepository.findOneCard(cardId);
};

export const saveSvc = async (card: Card) => {
  return CardRepository.saveCard(card);
};

export const removeSvc = async (card: Card) => {
  return CardRepository.removeCard(card);
};
