import Comment from './model';
import crypto from 'crypto';
import { asyncRoute } from '../../services/express';

export const add = asyncRoute(async (req, res) => {
  const comment = new Comment({});
  const secret = crypto.randomBytes(20).toString('hex');
  comment.secret = secret;
  comment.body = req.body.body;
  comment.pageId = req.query.pageId;
  comment.owner.name = req.body.owner.name;
  comment.owner.email = req.body.owner.email;
  await comment.save();

  res.json(comment);
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
