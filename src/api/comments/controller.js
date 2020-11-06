import Comment from './model';
import * as mailer from '../../services/mailer';
import { asyncRoute } from '../../services/express';

export const add = asyncRoute(async (req, res) => {
  const comment = new Comment({});
  await comment.insert(req.body).save();

  res.json(comment);
  mailer.newCommentNotification(comment);
});

export const list = asyncRoute(async (req, res) => {
  const comments = await Comment.find({ pageId: req.query.pageId })
    .select('owner.name body createdAt')
    .sort({ createdAt: 'desc' });

  res.json(comments);
});

export const remove = asyncRoute(async (req, res) => {
  const { deletedCount } = await Comment.deleteOne({
    _id: req.params.id,
    secret: req.query.secret,
  });

  res.sendStatus(deletedCount > 0 ? 200 : 400);
});
