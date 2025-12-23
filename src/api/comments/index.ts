import { Router } from 'express';
import { add, list, remove, listBySiteId, listReplies } from './controller';
import { access } from '@/services/express';

const router = Router();

router.get('/', list);
router.post('/', add);
router.delete('/:id', remove);

// Load more replies for a specific comment
router.get('/:commentId/replies', listReplies);

router.get('/sites/:siteId', access('admin'), listBySiteId);

export default router;
