import { Router } from 'express';
import { list, add } from './controller';

const router = Router();

router.post('/', add);
router.get('/', list);

export default router;
