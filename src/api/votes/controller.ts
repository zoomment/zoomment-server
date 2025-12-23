import Vote from './model';
import Comment from '@/api/comments/model';
import { asyncRoute } from '@/services/express';
import { BadRequestError, NotFoundError } from '@/utils';

/**
 * POST /votes
 * Body: { commentId, value: 1 | -1 }
 * Header: fingerprint
 *
 * - If no vote exists: create vote
 * - If same vote exists: remove vote (toggle off)
 * - If opposite vote exists: update vote
 */
export const vote = asyncRoute(async (req, res) => {
  const fingerprint = req.headers.fingerprint as string;
  const { commentId, value } = req.body;

  if (!fingerprint) {
    throw new BadRequestError('Fingerprint required for voting');
  }

  if (!commentId) {
    throw new BadRequestError('commentId is required');
  }

  if (value !== 1 && value !== -1) {
    throw new BadRequestError('value must be 1 (upvote) or -1 (downvote)');
  }

  // Check if comment exists
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new NotFoundError('Comment not found');
  }

  const existingVote = await Vote.findOne({ commentId, fingerprint });

  if (!existingVote) {
    // Create new vote
    await Vote.create({ commentId, fingerprint, value });
  } else if (existingVote.value === value) {
    // Same vote - remove it (toggle off)
    await Vote.deleteOne({ _id: existingVote._id });
  } else {
    // Different vote - update it
    existingVote.value = value;
    await existingVote.save();
  }

  // Get updated vote counts
  const counts = await getVoteCounts(commentId);
  const userVote = await Vote.findOne({ commentId, fingerprint });

  res.json({
    commentId,
    ...counts,
    userVote: userVote?.value || 0
  });
});

/**
 * GET /votes/:commentId
 * Header: fingerprint (optional)
 * Returns vote counts for a comment
 */
export const get = asyncRoute(async (req, res) => {
  const { commentId } = req.params;
  const fingerprint = req.headers.fingerprint as string;

  const counts = await getVoteCounts(commentId);

  let userVote = 0;
  if (fingerprint) {
    const vote = await Vote.findOne({ commentId, fingerprint });
    userVote = vote?.value || 0;
  }

  res.json({
    commentId,
    ...counts,
    userVote
  });
});

/**
 * GET /votes?commentIds=id1,id2,id3
 * Header: fingerprint (optional)
 * Returns vote counts for multiple comments
 */
export const getBulk = asyncRoute(async (req, res) => {
  const commentIds = ((req.query.commentIds as string) || '').split(',').filter(Boolean);
  const fingerprint = req.headers.fingerprint as string;

  if (commentIds.length === 0) {
    throw new BadRequestError('commentIds is required');
  }

  // Get all votes for these comments
  const votes = await Vote.find({ commentId: { $in: commentIds } });

  // Calculate counts per comment
  const result: Record<
    string,
    { upvotes: number; downvotes: number; score: number; userVote: number }
  > = {};

  for (const id of commentIds) {
    const commentVotes = votes.filter(v => String(v.commentId) === id);
    const upvotes = commentVotes.filter(v => v.value === 1).length;
    const downvotes = commentVotes.filter(v => v.value === -1).length;
    const userVote = fingerprint
      ? commentVotes.find(v => v.fingerprint === fingerprint)?.value || 0
      : 0;

    result[id] = {
      upvotes,
      downvotes,
      score: upvotes - downvotes,
      userVote
    };
  }

  res.json(result);
});

// Helper to get vote counts for a comment
async function getVoteCounts(commentId: string) {
  const votes = await Vote.find({ commentId });
  const upvotes = votes.filter(v => v.value === 1).length;
  const downvotes = votes.filter(v => v.value === -1).length;

  return {
    upvotes,
    downvotes,
    score: upvotes - downvotes
  };
}
