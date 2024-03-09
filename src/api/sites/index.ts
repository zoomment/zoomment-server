import { Router } from 'express';
import { add, list, remove } from './controller';
import { access } from '@/services/express';

const router = Router();

router.post('/', access('admin'), add);
router.get('/', access('admin'), list);
router.delete('/:id', access('admin'), remove);

export default router;
