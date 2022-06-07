import os from 'os';
import multer from 'multer';

export const uploadCSV = multer({ dest: os.tmpdir() });
