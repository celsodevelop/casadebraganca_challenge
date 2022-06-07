/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import * as CardController from '../controller/Card.controller';
import { removePhoto } from '../middlewares/removePhoto';
import { uploadCSV } from '../middlewares/uploadCSV';
import { uploadCardPhoto } from '../middlewares/uploadPhoto';

const router = Router();

router.get('/', CardController.all);
router.get('/:id', CardController.one);
router.post('/', uploadCardPhoto.single('card-image'), CardController.save);
router.put('/csv', uploadCSV.single('csv-file'), CardController.importCsv);
router.put('/:id', CardController.edit);
router.put(
  '/:id/photo',
  uploadCardPhoto.single('card-image'),
  CardController.editPhoto,
  removePhoto,
);
router.delete('/:id', CardController.remove, removePhoto);

export default router;
