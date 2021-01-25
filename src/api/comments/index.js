import { Router } from 'express';
import { view, add, list, remove } from './controller';

const router = new Router();

router.get('/', list);

router.post('/', add);

router.get('/:id', view);

router.delete('/:id', remove);

router.get('/:id/delete', remove);

export default router;
