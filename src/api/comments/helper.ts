import { TComment, TUser } from '@/types';

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
    createdAt: obj.createdAt,
    isVerified: obj.isVerified
  };
};
