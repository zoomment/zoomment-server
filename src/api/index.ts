import { Router } from 'express';
import comments from './comments';
import reactions from './reactions';
import users from './users';

const router = Router();

router.use('/comments', comments);
router.use('/reactions', reactions);
router.use('/users', users);

export default router;
