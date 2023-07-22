import Reaction from './model';

export const getReactions = async ({ fingerprint, pageId }) => {

  const userReactionPromise = Reaction.findOne({ fingerprint, pageId });
  const pageViewsPromise = Reaction.find({ pageId }).count();
  const aggregationPromise = Reaction.aggregate()
    .match({
      fingerprint,
      pageId
    })
    .group({
      _id: '$reaction',
      count: { $count: {} }
    });

  const [aggregation, reaction, pageViews] = await Promise.all([
    aggregationPromise,
    userReactionPromise,
    pageViewsPromise
  ]);

  return { aggregation, reaction, pageViews };
};
