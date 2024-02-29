import { Router } from 'express';
import { add, list, remove } from './controller';

const router = Router();

router.get('/', list);

router.post('/', add);

router.delete('/:id', remove);

router.get('/:id/delete', remove);

export default router;
