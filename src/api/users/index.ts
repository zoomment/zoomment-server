import { Router } from 'express';
import { auth } from './controller';

const router = Router();

router.post('/auth', auth);

export default router;
