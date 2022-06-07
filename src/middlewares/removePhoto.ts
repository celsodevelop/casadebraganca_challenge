import { v2 as cloudinary } from 'cloudinary';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Card } from '../db/entity/Card.entity';
import AppError from '../errors/AppError';

export const removePhoto = async (req: Request, res: Response, next: NextFunction) => {
  // regex to get public_id cloudinary from stored photo path field
  // created from this pattern: cdbrag-challenge/filename
  const filenameRegex = /\w+.\w+\/\w+(?=.jpg|.png|.jpeg)/i;
  const {
    locals: { removedCard = new Card() },
  } = res as Response & { locals: { removedCard: Card } };
  try {
    if (!removedCard?.photo) {
      return res.status(StatusCodes.ACCEPTED).json({ result: 'ok' });
    }
    const filenameToRemove = filenameRegex.exec(removedCard.photo)?.[0];
    const fileRemovedInfo =
      filenameToRemove &&
      ((await cloudinary.uploader.destroy(filenameToRemove)) as { result: string });
    if (fileRemovedInfo && fileRemovedInfo?.result !== 'ok') {
      console.error(
        new AppError(
          StatusCodes.NOT_FOUND,
          // eslint-disable-next-line max-len
          `What happened with this file at cloud: ${filenameToRemove}? error: ${fileRemovedInfo.result}`,
        ),
      );
      return res.status(StatusCodes.ACCEPTED).json({ result: 'ok' });
    }
    return res.status(StatusCodes.ACCEPTED).json(fileRemovedInfo);
  } catch (error) {
    return next(error);
  }
};
