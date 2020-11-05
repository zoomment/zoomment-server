import { Router } from 'express';
import comments from './comments';

const router = new Router();

router.use('/comments', comments);

export default router;
