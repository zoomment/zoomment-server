import Comment from './model';
import Site from '@/api/sites';
import * as mailer from '@/services/mailer';
import { asyncRoute } from '@/services/express';

export const add = asyncRoute(async (req, res) => {
  //TODO add validation
  const url = new URL(req.body.pageUrl);

  const data = {
    body: req.body.body,
    owner: {
      name: req.body.owner.name,
      email: req.body.owner.email
    },
    domain: url.hostname,
    pageUrl: url.href,
    pageId: req.body.pageId
  };

  const comment = await Comment.create(data);

  res.json(comment);
  mailer.newCommentNotification(comment);
});

export const list = asyncRoute(async (req, res) => {
  const comments = await Comment.find({ pageId: req.query.pageId })
    .select('owner.name owner.gravatar body createdAt')
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
