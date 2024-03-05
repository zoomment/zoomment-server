import { Router } from 'express';
import { add, list, remove, listBySiteId } from './controller';

const router = Router();

router.get('/', list);
router.get('/sites/:id', listBySiteId);
router.post('/', add);
router.delete('/:id', remove);
router.get('/:id/delete', remove);

export default router;
