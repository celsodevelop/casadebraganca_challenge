import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Card } from '../db/entity/Card.entity';
import { removePhotoFromCloud } from '../utils/removePhotoFromCloud';

export const removePhoto = async (req: Request, res: Response, next: NextFunction) => {
  const {
    locals: { oldCardData = new Card(), newCardData },
  } = res as Response & { locals: { oldCardData: Card; newCardData?: Card } };
  try {
    if (!oldCardData?.photo) {
      return res.status(StatusCodes.ACCEPTED).json(newCardData || { result: 'ok' });
    }
    await removePhotoFromCloud(oldCardData);
    return res.status(StatusCodes.ACCEPTED).json(newCardData || { result: 'ok' });
  } catch (error) {
    return next(error);
  }
};
