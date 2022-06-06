import { Router } from 'express';
import * as CardController from '../controller/Card.controller';
import { uploadCardPhoto } from '../middlewares/uploadPhoto';

const router = Router();

router.get('/', CardController.all);
router.get('/:id', CardController.one);
router.post('/', uploadCardPhoto.single('card-image'), CardController.save)


export default router;
