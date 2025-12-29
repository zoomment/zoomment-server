import { Router } from 'express';
import { auth, profile, remove, getAll } from './controller';
import { access } from '@/services/express';

const router = Router();

router.get('/', access('superAdmin'), getAll);

router.post('/auth', auth);

router.get('/profile', access(), profile);

router.delete('/', access(), remove);

export default router;
