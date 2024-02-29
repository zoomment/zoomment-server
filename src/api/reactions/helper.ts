import Reaction from './model';

export const getPageData = async ({
  fingerprint,
  pageId
}: {
  fingerprint: string;
  pageId: string;
}) => {
  const userReactionPromise = Reaction.findOne({
    fingerprint,
    pageId
  }).select('reaction -_id');

  const aggregationPromise = Reaction.aggregate()
    .match({
      pageId
    })
    .group({
      _id: '$reaction',
      count: { $count: {} }
    });

  const [aggregation, userReaction] = await Promise.all([
    aggregationPromise,
    userReactionPromise
  ]);

  return { aggregation, userReaction };
};
