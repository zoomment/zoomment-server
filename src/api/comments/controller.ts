import Comment from './model';
import Site from '@/api/sites/model';
import * as mailer from '@/services/mailer';
import { asyncRoute } from '@/services/express';
import crypto from 'crypto';

export const add = asyncRoute(async (req, res) => {
  //TODO add validation
  const url = new URL(req.body.pageUrl);
  const gravatar = crypto
    .createHash('md5')
    .update(req.body.owner.email || '')
    .digest('hex');

  const data = {
    body: req.body.body,
    // owner field deprecated
    owner: {
      name: req.body.owner.name,
      email: req.body.owner.email,
      gravatar
    },
    gravatar,
    author: req.body.owner.name,
    email: req.body.owner.email,
    domain: url.hostname,
    pageUrl: url.href,
    pageId: req.body.pageId,
    secret: crypto.randomBytes(20).toString('hex')
  };

  const comment = await Comment.create(data);

  res.json(comment);
  mailer.newCommentNotification(comment);
});

export const list = asyncRoute(async (req, res) => {
  const comments = await Comment.find({ pageId: req.query.pageId })
    .select('owner.name owner.gravatar body createdAt gravatar author')
    .sort({ createdAt: 'desc' });

  res.json(comments);
});

export const remove = asyncRoute(async (req, res) => {
  // TODO add separate route for websites admin
  const { deletedCount } = await Comment.deleteOne({
    _id: req.params.id,
    secret: req.query.secret
  });

  res.sendStatus(deletedCount > 0 ? 200 : 400);
});

export const listBySiteId = asyncRoute(async (req, res) => {
  const siteId = req.params.siteId;
  const site = await Site.findById(siteId);

  if (!site || String(site.userId) !== String(req.user.id)) {
    res.status(400).json({ message: 'Site not found' });
    return;
  }

  const comments = await Comment.find({ domain: site.domain });
  res.json(comments);
});
