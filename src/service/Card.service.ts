import { StatusCodes } from 'http-status-codes';
import { Card } from '../db/entity/Card.entity';
import AppError from '../errors/AppError';
import { CardModel } from '../model/Card.model';
import errorMessages from '../errors/errorMessages.json';

export const allSvc = async (page: number) => {
  return CardModel.findAllCards(page);
};

export const oneSvc = async (cardId: string) => {
  const selectedCard = await CardModel.findOneCard(cardId);
  if (!selectedCard) {
    throw new AppError(StatusCodes.NOT_FOUND, errorMessages.CARD_NOT_FOUND);
  }
  return selectedCard;
};

export const saveSvc = async (card: Card) => {
  return CardModel.saveCard(card);
};

export const editSvc = async (card: Card, newInfo: Partial<Card>) => {
  if (Object.keys(newInfo).length === 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, errorMessages.INVALID_CARD);
  }
  const cardEditedInfo = await CardModel.editCard(card, newInfo);
  if (!cardEditedInfo.affected) {
    throw new AppError(StatusCodes.NOT_MODIFIED, errorMessages.CARD_NOT_MODIFIED);
  }
  return cardEditedInfo;
};

export const removeSvc = async (card: Card) => {
  return CardModel.removeCard(card);
};
