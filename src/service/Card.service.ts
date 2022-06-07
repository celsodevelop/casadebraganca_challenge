import { Card } from '../db/entity/Card.entity';
import { CardModel } from '../model/Card.model';

export const allSvc = async (page: number) => {
  return CardModel.findAllCards(page);
};

export const oneSvc = async (cardId: string) => {
  return CardModel.findOneCard(cardId);
};

export const saveSvc = async (card: Card) => {
  return CardModel.saveCard(card);
};

export const editSvc = async (card: Card, newInfo: Partial<Card>) => {
  return CardModel.editCard(card, newInfo);
};

export const removeSvc = async (card: Card) => {
  return CardModel.removeCard(card);
};
