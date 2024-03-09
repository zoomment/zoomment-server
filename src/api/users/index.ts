import { Router } from 'express';
import { auth, profile } from './controller';
import { access } from '@/services/express';

const router = Router();

router.post('/auth', auth);

router.get('/profile', access(), profile);

export default router;
