import { v2 as cloudinary } from 'cloudinary';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Card } from '../db/entity/Card.entity';

export const removePhoto = async (req: Request, res: Response, next: NextFunction) => {
  // regex to get public_id cloudinary from stored photo path field
  // get from this pattern: cdbrag-challenge/filename
  const filenameRegex = /\w+.\w+\/\w+(?=.jpg|.png|.jpeg)/i;
  const {
    locals: { cardToRemove = new Card() },
  } = res as Response & { locals: { cardToRemove: Card } };
  try {
    if (!cardToRemove?.photo) {
      return res.status(StatusCodes.ACCEPTED).json({ result: 'ok' });
    }
    const filenameToRemove = filenameRegex.exec(cardToRemove?.photo)?.[0];
    const fileRemovedInfo =
      filenameToRemove &&
      ((await cloudinary.uploader.destroy(filenameToRemove)) as { result: string });
    return res.status(StatusCodes.ACCEPTED).json(fileRemovedInfo);
  } catch (error) {
    return next(error);
  }
};
