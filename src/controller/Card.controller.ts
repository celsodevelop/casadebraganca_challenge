import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Card } from '../db/entity/Card.entity';
import * as CardServices from '../service/Card.service';
import { parseCardToResponse } from '../utils/parseCardToResponse';
import { checkUUIDv4 } from '../utils/uuidCheck';

export const all = async (request: Request, response: Response, next: NextFunction) => {
  let cardsPage;
  const { page: reqPage = 0 } = request.query;
  try {
    if (typeof reqPage === 'string') {
      const parsedPage = parseInt(reqPage, 10) - 1;
      cardsPage = await CardServices.allSvc(parsedPage);
    } else {
      cardsPage = await CardServices.allSvc(Number(reqPage));
    }
    const parsedCards = cardsPage.cards.map((card) => parseCardToResponse(card));
    return response.status(StatusCodes.OK).json({
      ...cardsPage,
      cards: parsedCards,
    });
  } catch (error) {
    return next(error);
  }
};

export const one = async (request: Request, response: Response, next: NextFunction) => {
  try {
    checkUUIDv4(request.params.id);
    const selectedCard = await CardServices.oneSvc(request.params.id);
    return response.status(StatusCodes.OK).json(parseCardToResponse(selectedCard));
  } catch (error) {
    return next(error);
  }
};

export const save = async (request: Request, response: Response, next: NextFunction) => {
  try {
    // desestruturamos para não permitir dados não requisitados integrando os cartões
    const { name, company, email, jobTitle, phoneNumber } = request.body as Card;
    const newCard = {
      name,
      company,
      email,
      jobTitle,
      phoneNumber,
      photo: request.file?.path,
    } as Card;
    const createdCard = await CardServices.saveSvc(newCard);
    return response.status(StatusCodes.ACCEPTED).json(parseCardToResponse(createdCard));
  } catch (error) {
    return next(error);
  }
};

export const remove = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    checkUUIDv4(request.params.id);
    const userToRemove = await CardServices.oneSvc(request.params.id);
    const removedCard = await CardServices.removeSvc(userToRemove);
    response.locals.oldCardData = removedCard;
    // deixa o próximo middleware lidar com a remoção do arquivo da nuvem
    return next();
  } catch (error) {
    return next(error);
  }
};

export const edit = async (request: Request, response: Response, next: NextFunction) => {
  try {
    checkUUIDv4(request.params.id);
    const cardToEdit = await CardServices.oneSvc(request.params.id);
    // remove photo e id do body para não permitir alterações sensíveis nessa rota;
    const { photo, id, ...secureUpdateInfo } = request.body as Partial<Card>;
    await CardServices.editSvc(cardToEdit, secureUpdateInfo);
    return response
      .status(StatusCodes.ACCEPTED)
      .json(parseCardToResponse({ ...cardToEdit, ...secureUpdateInfo }));
  } catch (error) {
    return next(error);
  }
};

export const editPhoto = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    checkUUIDv4(request.params.id);
    const cardToEditPhoto = await CardServices.oneSvc(request.params.id);
    const newPhotoField = {
      photo: request.file?.path || null,
    };
    await CardServices.editSvc(cardToEditPhoto, newPhotoField);
    response.locals.oldCardData = cardToEditPhoto;
    response.locals.newCardData = parseCardToResponse({
      ...cardToEditPhoto,
      ...newPhotoField,
    });
    // deixa o próximo middleware lidar com a remoção do arquivo anterior da nuvem
    return next();
  } catch (error) {
    return next(error);
  }
};
