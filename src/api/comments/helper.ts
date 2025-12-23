import { TComment, TUser } from '@/types';
import { cleanEmail, cleanName, sanitizeText, sanitizeCommentBody } from '@/utils';
import crypto from 'crypto';

interface CommentInput {
  pageUrl: string;
  email?: string;
  author?: string;
  owner?: {
    email: string;
    name: string;
  };
  parentId?: string;
  body: string;
  pageId: string;
}

export const createCommentData = (obj: CommentInput, user?: TUser) => {
  const url = new URL(obj.pageUrl);
  const email = cleanEmail(obj.email || obj?.owner?.email || '');
  const author = sanitizeText(cleanName(obj.author || obj?.owner?.name || ''));
  const parentId = obj.parentId;
  const domain = url.hostname;
  const gravatar = crypto.createHash('md5').update(email).digest('hex');

  const isVerified = user && user.email === email;

  const data = {
    body: sanitizeCommentBody(obj.body),
    author,
    email,
    domain,
    gravatar,
    parentId,
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
    isOwn,
    body: obj.body,
    author: obj.author,
    gravatar: obj.gravatar,
    parentId: obj.parentId,
    createdAt: obj.createdAt,
    isVerified: obj.isVerified
  };
};
