import { Router } from 'express';
import { add, list, remove, listBySiteId } from './controller';
import { access } from '@/services/express';

const router = Router();

router.get('/', list);
router.post('/', add);
router.delete('/:id', remove);

router.get('/sites/:siteId', access('admin'), listBySiteId);

export default router;
