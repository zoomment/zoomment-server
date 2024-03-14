import Comment from './model';
import Site from '@/api/sites/model';
import User from '@/api/users/model';
import * as mailer from '@/services/mailer';
import { asyncRoute } from '@/services/express';
import { cleanEmail } from '@/utils';
import { getCommentPublicData } from './helper';
import crypto from 'crypto';

export const add = asyncRoute(async (req, res) => {
  //TODO add validation
  const url = new URL(req.body.pageUrl);
  const email = cleanEmail(req.body.email || req.body?.owner.email || '');
  const author = req.body.author || req.body?.owner.name || '';
  const parentId = req.body.parentId;
  const domain = url.hostname;
  const gravatar = crypto.createHash('md5').update(email).digest('hex');

  const isVerified = req.user && req.user.email === email;

  const data = {
    body: req.body.body,
    // owner field deprecated
    owner: { name: author, email, gravatar },
    parentId,
    gravatar,
    author,
    email,
    domain,
    isVerified,
    pageUrl: url.href,
    pageId: req.body.pageId,
    secret: crypto.randomBytes(20).toString('hex')
  };

  const comment = await Comment.create(data);

  res.json(comment);

  const site = await Site.findOne({ domain });
  if (!site) return;

  const user = await User.findById(site.userId);
  if (user && user.email !== email) {
    mailer.newCommentNotification(user.email, comment);
  }
});

export const list = asyncRoute(async (req, res) => {
  const query: any = {
    parentId: null
  };

  if (req.query.pageId) {
    query.pageId = req.query.pageId;
  } else if (req.query.domain) {
    query.domain = req.query.domain;
  }

  const comments = await Comment.find(query).sort({ createdAt: 'asc' });

  const commentsWithReplies = await Promise.all(
    comments.map(comment =>
      Comment.find({ parentId: comment.id })
        .sort({ createdAt: 'asc' })
        .then(replies => {
          return {
            ...getCommentPublicData(comment, req.user),
            replies: replies.map(reply => getCommentPublicData(reply, req.user))
          };
        })
    )
  );

  res.json(commentsWithReplies);
});

export const remove = asyncRoute(async (req, res) => {
  // TODO add separate route for websites admin
  const query: any = {
    _id: req.params.id
  };

  if (query.secret) {
    query.secret = req.query.secret;
  } else if (req.user) {
    query.email = cleanEmail(req.user.email);
  } else {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  const { deletedCount } = await Comment.deleteOne(query);

  if (deletedCount > 0) {
    res.status(200).json({ _id: req.params.id });
  } else {
    res.status(404).json({ message: 'Comment not found' });
  }
});

export const listBySiteId = asyncRoute(async (req, res) => {
  const siteId = req.params.siteId;
  const site = await Site.findById(siteId);

  if (!site || String(site.userId) !== String(req.user.id)) {
    res.status(404).json({ message: 'Site not found' });
    return;
  }

  const comments = await Comment.find({ domain: site.domain }).sort({
    createdAt: 'desc'
  });

  res.status(200).json(comments);
});
