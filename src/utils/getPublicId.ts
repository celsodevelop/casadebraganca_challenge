import { Card } from '../db/entity/Card.entity';

// Regex below to get public_id cloudinary from stored photo path field
// created from this cloudinary pattern: cdbrag-challenge/filename

const CLOUD_CDB_CHALL_FILENAME_REGEX = /\w+.\w+.\w+(?=.jpg|.png|.jpeg)/;

export const getPhotoCloudinaryPublicId = (card: Card = new Card()) => {
  const filenameRegex = new RegExp(CLOUD_CDB_CHALL_FILENAME_REGEX, 'i');
  return filenameRegex.exec(card?.photo || '')?.[0] || '';
};
