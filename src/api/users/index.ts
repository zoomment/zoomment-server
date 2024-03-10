import { Router } from 'express';
import { auth, profile, remove } from './controller';
import { access } from '@/services/express';

const router = Router();

router.post('/auth', auth);
router.get('/profile', access(), profile);
router.delete('/', access(), remove);

export default router;
