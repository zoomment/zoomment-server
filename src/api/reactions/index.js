import { Router } from 'express';
import { reactOrView } from './controller';

const router = new Router();

router.post('/', reactOrView);
router.get('/', reactOrView);

export default router;
