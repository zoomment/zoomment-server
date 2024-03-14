import Comment from './model';
import Site from '@/api/sites/model';
import User from '@/api/users/model';
import * as mailer from '@/services/mailer';
import { asyncRoute } from '@/services/express';
import { cleanEmail } from '@/utils';
import jwt from 'jsonwebtoken';
import { getCommentPublicData, createCommentData } from './helper';

export const add = asyncRoute(async (req, res) => {
  //TODO add validation
  const data = createCommentData(req.body, req.user);

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

  if (req.query.secret) {
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
