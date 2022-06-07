import { v2 as cloudinary } from 'cloudinary';
import { StatusCodes } from 'http-status-codes';
import { Card } from '../db/entity/Card.entity';
import AppError from '../errors/AppError';
import { getPhotoCloudinaryPublicId } from './getPublicId';

export const removePhotoFromCloud = async (card: Card) => {
  const fileRemovedInfo = (await cloudinary.uploader.destroy(
    getPhotoCloudinaryPublicId(card),
  )) as {
    result: string;
  };
  if (fileRemovedInfo && fileRemovedInfo?.result !== 'ok') {
    console.error(
      new AppError(
        StatusCodes.NOT_FOUND,
        // eslint-disable-next-line max-len
        `What happened with this file at cloud: ${card.photo}? error: ${fileRemovedInfo.result}`,
      ),
    );
  }
};
