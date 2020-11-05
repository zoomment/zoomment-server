import { Router } from 'express';
import { add, list, remove } from './controller';

const router = new Router();

router.get('/', list);

router.post('/', add);

router.delete('/:id', remove);

export default router;
