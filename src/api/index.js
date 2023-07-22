import { Router } from 'express';
import comments from './comments';
import reactions from './reactions';

const router = new Router();

router.use('/comments', comments);
router.use('/reactions', reactions);

export default router;
