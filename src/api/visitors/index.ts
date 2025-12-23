import { Router } from 'express';
import { track, count, countByDomain } from './controller';

const router = Router();

// Track a visitor (POST with fingerprint header)
router.post('/', track);

// Get visitor count for a page
router.get('/', count);

// Get visitor count for entire domain
router.get('/domain', countByDomain);

export default router;
