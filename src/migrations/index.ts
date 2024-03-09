import Comment from '@/api/comments/model';
import Reactions from '@/api/reactions/model';

export const migrate = async () => {
  const comments = await Comment.find({});

  await comments.reduce((promise, comment) => {
    comment.email = comment.owner.email;
    comment.author = comment.owner.name;
    comment.gravatar = comment.owner.gravatar;

    const url = new URL('https://' + comment.pageId);
    comment.domain = url.hostname;
    return promise.then(() => comment.save());
  }, Promise.resolve({}));

  const reactions = await Reactions.find({});

  await reactions.reduce((promise, reaction) => {
    const url = new URL('https://' + reaction.pageId);
    reaction.domain = url.hostname;
    return promise.then(() => reaction.save());
  }, Promise.resolve({}));
};
