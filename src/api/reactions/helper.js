import Reaction from './model';

export const getPageData = async ({ fingerprint, pageId }) => {

  const userReactionPromise = Reaction.findOne({ fingerprint, pageId }).select('reaction -_id');
  const pageViewsPromise = Reaction.find({ pageId }).count();
  const aggregationPromise = Reaction.aggregate()
    .match({
      pageId
    })
    .group({
      _id: '$reaction',
      count: { $count: {} }
    });

  const [aggregation, userReaction, pageViews] = await Promise.all([
    aggregationPromise,
    userReactionPromise,
    pageViewsPromise
  ]);

  return { aggregation, userReaction, pageViews };
};
