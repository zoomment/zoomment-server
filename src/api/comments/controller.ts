import Comment from './model';
import Site from '@/api/sites/model';
import User from '@/api/users/model';
import * as mailer from '@/services/mailer';
import { asyncRoute } from '@/services/express';
import {
  cleanEmail,
  commentSchema,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  sanitizeCommentBody
} from '@/utils';
import jwt from 'jsonwebtoken';
import { getCommentPublicData, createCommentData } from './helper';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

// Helper to parse pagination params
const getPagination = (query: { limit?: string; skip?: string }) => {
  const limit = Math.min(parseInt(query.limit || '') || DEFAULT_LIMIT, MAX_LIMIT);
  const skip = parseInt(query.skip || '') || 0;
  return { limit, skip };
};

export const add = asyncRoute(async (req, res) => {
  const result = commentSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map((e: { message: string }) => e.message);
    throw new BadRequestError(errors.join(', '));
  }

  const sanitizedBody = {
    ...result.data,
    body: sanitizeCommentBody(result.data.body)
  };

  const data = createCommentData(sanitizedBody, req.user ?? undefined);
  const comment = await Comment.create(data);

  res.json(comment);

  // Send confirmation email to guest
  if (!req.user) {
    let user = await User.findOne({ email: data.email });
    if (!user) {
      user = await User.create({ email: data.email, name: data.author });
    }

    const token = jwt.sign(
      { id: user.id, email: data.email, name: data.author },
      process.env.JWT_SECRET as string,
      { expiresIn: '1y', algorithm: 'HS256' }
    );

    mailer.sendEmailVerificationLink({
      userEmail: data.email,
      authToken: token,
      pageUrl: data.pageUrl
    });
  }

  // Notify site owner
  const site = await Site.findOne({ domain: data.domain });
  if (!site) return;

  const siteOwner = await User.findById(site.userId);
  if (siteOwner && siteOwner.email !== data.email) {
    mailer.sendCommentNotification(siteOwner.email, comment);
  }
});

/**
 * GET /comments?pageId=xxx&limit=10&skip=0
 * Returns parent comments only, with repliesCount for each
 */
export const list = asyncRoute(async (req, res) => {
  const pageId = req.query.pageId as string;
  const domain = req.query.domain as string;

  if (!pageId && !domain) {
    throw new BadRequestError('pageId or domain is required');
  }

  const { limit, skip } = getPagination(req.query as { limit?: string; skip?: string });
  const filter = pageId ? { pageId, parentId: null } : { domain, parentId: null };

  // Get parent comments
  const [comments, total] = await Promise.all([
    Comment.find(filter).sort({ createdAt: 'asc' }).skip(skip).limit(limit),
    Comment.countDocuments(filter)
  ]);

  // Get reply counts for each comment
  const commentIds = comments.map(c => String(c._id));
  const replyCounts = await Comment.aggregate([
    { $match: { parentId: { $in: commentIds } } },
    { $group: { _id: '$parentId', count: { $sum: 1 } } }
  ]);

  const replyCountMap = new Map(replyCounts.map(r => [r._id, r.count]));

  const result = comments.map(comment => ({
    ...getCommentPublicData(comment, req.user ?? undefined),
    repliesCount: replyCountMap.get(String(comment._id)) || 0
  }));

  res.json({
    comments: result,
    total,
    limit,
    skip,
    hasMore: skip + comments.length < total
  });
});

/**
 * GET /comments/:commentId/replies?limit=10&skip=0
 * Returns replies for a specific parent comment
 */
export const listReplies = asyncRoute(async (req, res) => {
  const { commentId } = req.params;
  const { limit, skip } = getPagination(req.query as { limit?: string; skip?: string });

  const [replies, total] = await Promise.all([
    Comment.find({ parentId: commentId })
      .sort({ createdAt: 'asc' })
      .skip(skip)
      .limit(limit),
    Comment.countDocuments({ parentId: commentId })
  ]);

  res.json({
    replies: replies.map(r => getCommentPublicData(r, req.user ?? undefined)),
    total,
    limit,
    skip,
    hasMore: skip + replies.length < total
  });
});

export const remove = asyncRoute(async (req, res) => {
  interface DeleteQuery {
    _id: string;
    secret?: string;
    email?: string;
  }

  const query: DeleteQuery = { _id: req.params.id };

  if (req.query.secret) {
    query.secret = req.query.secret as string;
  } else if (req.user) {
    query.email = cleanEmail(req.user.email);
  } else {
    throw new ForbiddenError();
  }

  const { deletedCount } = await Comment.deleteOne(query);

  if (deletedCount > 0) {
    res.status(200).json({ _id: req.params.id });
  } else {
    throw new NotFoundError('Comment not found');
  }
});

export const listBySiteId = asyncRoute(async (req, res) => {
  const site = await Site.findById(req.params.siteId);

  if (!site || !req.user || String(site.userId) !== String(req.user.id)) {
    throw new NotFoundError('Site not found');
  }

  const { limit, skip } = getPagination(req.query as { limit?: string; skip?: string });

  const [comments, total] = await Promise.all([
    Comment.find({ domain: site.domain })
      .sort({ createdAt: 'desc' })
      .skip(skip)
      .limit(limit),
    Comment.countDocuments({ domain: site.domain })
  ]);

  res.json({
    comments,
    total,
    limit,
    skip,
    hasMore: skip + comments.length < total
  });
});
