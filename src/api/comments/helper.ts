import { TComment, TUser } from '@/types';
import { cleanEmail, cleanName } from '@/utils';
import crypto from 'crypto';

export const createCommentData = (obj: any, user?: TUser) => {
  const url = new URL(obj.pageUrl);
  const email = cleanEmail(obj.email || obj?.owner.email || '');
  const author = cleanName(obj.author || obj?.owner.name || '');
  const parentId = obj.parentId;
  const domain = url.hostname;
  const gravatar = crypto.createHash('md5').update(email).digest('hex');

  const isVerified = user && user.email === email;

  const data = {
    body: obj.body,
    // owner field deprecated
    owner: { name: author, email, gravatar },
    parentId,
    gravatar,
    author,
    email,
    domain,
    isVerified,
    pageUrl: url.href,
    pageId: obj.pageId,
    secret: crypto.randomBytes(20).toString('hex')
  };

  return data;
};

export const getCommentPublicData = (comment: TComment, user?: TUser) => {
  const obj = comment.toObject();
  const isOwn = user && user.email === comment.email;

  return {
    _id: obj._id,
    owner: {
      name: obj.author,
      gravatar: obj.gravatar
    },
    isOwn,
    body: obj.body,
    author: obj.author,
    gravatar: obj.gravatar,
    parentId: obj.parentId,
    createdAt: obj.createdAt,
    isVerified: obj.isVerified
  };
};
