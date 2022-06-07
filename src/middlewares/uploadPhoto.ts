import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: () => {
    return {
      folder: 'cdbrag-challenge',
      allowedFormats: ['jpeg', 'png', 'jpg'],
      format: 'jpeg',
    };
  },
});

export const uploadCardPhoto = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5 MB
  },
});
