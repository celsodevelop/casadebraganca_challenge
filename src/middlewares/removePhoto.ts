import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Card } from '../db/entity/Card.entity';
import { removePhotoFromCloud } from '../utils/removePhotoFromCloud';

export const removePhoto = async (req: Request, res: Response, next: NextFunction) => {
  const {
    locals: { removedCard = new Card() },
  } = res as Response & { locals: { removedCard: Card } };
  try {
    if (!removedCard?.photo) {
      return res.status(StatusCodes.ACCEPTED).json({ result: 'ok' });
    }
    await removePhotoFromCloud(removedCard);
    return res.status(StatusCodes.ACCEPTED).json({ result: 'ok' });
  } catch (error) {
    return next(error);
  }
};
