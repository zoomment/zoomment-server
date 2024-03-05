import { Router } from 'express';
import { add, list } from './controller';
import { access } from '@/services/express';

const router = Router();

router.post('/', access('admin'), add);
router.get('/', access('admin'), list);

export default router;
