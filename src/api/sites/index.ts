import { Router } from 'express';
import { add } from './controller';
import { access } from '@/services/express';

const router = Router();

router.post('/', access('admin'), add);

export default router;
