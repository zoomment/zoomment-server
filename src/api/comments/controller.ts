import Comment from './model';
import Site from '@/api/sites/model';
import User from '@/api/users/model';
import * as mailer from '@/services/mailer';
import { asyncRoute } from '@/services/express';
import crypto from 'crypto';

export const add = asyncRoute(async (req, res) => {
  //TODO add validation
  const url = new URL(req.body.pageUrl);
  const email = req.body.email || req.body?.owner.email || '';
  const author = req.body.author || req.body?.owner.name || '';
  const parentId = req.body.parentId;
  const domain = url.hostname;
  const gravatar = crypto.createHash('md5').update(email).digest('hex');

  const data = {
    body: req.body.body,
    // owner field deprecated
    owner: { name: author, email, gravatar },
    parentId,
    gravatar,
    author,
    email,
    domain,
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

  const comments = await Comment.find(query)
    .select('owner.name owner.gravatar body createdAt gravatar author')
    .sort({ createdAt: 'asc' });

  const commentsWithReplies = await Promise.all(
    comments.map(comment => {
      return Comment.find({ parentId: comment.id })
        .select('owner.name owner.gravatar body createdAt gravatar author parentId')
        .sort({ createdAt: 'asc' })
        .then(replies => {
          return {
            ...comment.toObject(),
            replies
          };
        });
    })
  );

  res.json(commentsWithReplies);
});

export const remove = asyncRoute(async (req, res) => {
  // TODO add separate route for websites admin
  const { deletedCount } = await Comment.deleteOne({
    _id: req.params.id,
    secret: req.query.secret
  });

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
