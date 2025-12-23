import { Router } from 'express';
import { vote, get, getBulk } from './controller';

const router = Router();

// Vote on a comment (upvote/downvote)
router.post('/', vote);

// Get votes for multiple comments (bulk)
router.get('/', getBulk);

// Get votes for a single comment
router.get('/:commentId', get);

export default router;
