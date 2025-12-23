import { Router } from 'express';
import comments from './comments';
import reactions from './reactions';
import users from './users';
import sites from './sites';
import visitors from './visitors';
import votes from './votes';

const router = Router();

router.use('/comments', comments);
router.use('/reactions', reactions);
router.use('/users', users);
router.use('/sites', sites);
router.use('/visitors', visitors);
router.use('/votes', votes);

export default router;
