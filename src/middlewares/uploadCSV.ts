import os from 'os';
import multer from 'multer';

export const uploadCSV = multer({
  dest: os.tmpdir(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5 MB
  },
});
