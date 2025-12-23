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

export const add = asyncRoute(async (req, res) => {
  // Validate input
  const result = commentSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map((e: { message: string }) => e.message);
    throw new BadRequestError(errors.join(', '));
  }

  // Sanitize the comment body
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

  // Send an email notification to the site owner about a new comment
  const site = await Site.findOne({ domain: data.domain });

  if (!site) return;

  const siteOwner = await User.findById(site.userId);

  if (siteOwner && siteOwner.email !== data.email) {
    mailer.sendCommentNotification(siteOwner.email, comment);
  }
});

export const list = asyncRoute(async (req, res) => {
  // Build base query for filtering by pageId or domain
  const baseQuery: { pageId?: string; domain?: string } = {};

  if (req.query.pageId) {
    baseQuery.pageId = req.query.pageId as string;
  } else if (req.query.domain) {
    baseQuery.domain = req.query.domain as string;
  } else {
    throw new BadRequestError('pageId or domain is required');
  }

  // Fetch all comments (both parents and replies) in a single query
  const allComments = await Comment.find(baseQuery).sort({ createdAt: 'asc' });

  // Separate parent comments and replies
  const parentComments = allComments.filter(c => !c.parentId);
  const replies = allComments.filter(c => c.parentId);

  // Map parent comments with their replies
  const commentsWithReplies = parentComments.map(comment => ({
    ...getCommentPublicData(comment, req.user ?? undefined),
    replies: replies
      .filter(r => String(r.parentId) === String(comment._id))
      .map(r => getCommentPublicData(r, req.user ?? undefined))
  }));

  res.json(commentsWithReplies);
});

export const remove = asyncRoute(async (req, res) => {
  interface DeleteQuery {
    _id: string;
    secret?: string;
    email?: string;
  }

  const query: DeleteQuery = {
    _id: req.params.id
  };

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
  const siteId = req.params.siteId;
  const site = await Site.findById(siteId);

  if (!site || !req.user || String(site.userId) !== String(req.user.id)) {
    throw new NotFoundError('Site not found');
  }

  const comments = await Comment.find({ domain: site.domain }).sort({
    createdAt: 'desc'
  });

  res.status(200).json(comments);
});
