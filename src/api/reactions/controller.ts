import Reaction from './model';
import { getPageData } from './helper';
import { asyncRoute } from '@/services/express';
import { reactionSchema, BadRequestError, sanitizeText } from '@/utils';

export const add = asyncRoute(async (req, res) => {
  // Validate input
  const result = reactionSchema.safeParse({
    pageId: req.body.pageId || req.query.pageId,
    reaction: req.body.reaction
  });

  if (!result.success) {
    const errors = result.error.issues.map((e: { message: string }) => e.message);
    throw new BadRequestError(errors.join(', '));
  }

  const fingerprint: string = req.headers.fingerprint as string;
  const { pageId, reaction } = result.data;
  const sanitizedReaction = sanitizeText(reaction);

  // Extract domain from pageId
  const url = new URL('https://' + pageId);

  if (!fingerprint) {
    throw new BadRequestError('Fingerprint required for reacting');
  }

  const searchCondition = { pageId, fingerprint, domain: url.hostname };
  const recordInDB = await Reaction.findOne(searchCondition);

  if (!recordInDB) {
    await Reaction.create({ ...searchCondition, reaction: sanitizedReaction });
  } else {
    if (recordInDB.reaction === sanitizedReaction) {
      await Reaction.deleteOne({ _id: recordInDB.id });
    } else {
      recordInDB.reaction = sanitizedReaction;
      await recordInDB.save();
    }
  }

  const reactions = await getPageData(searchCondition);

  res.status(200).json(reactions);
});

export const list = asyncRoute(async (req, res) => {
  const fingerprint: string = req.headers.fingerprint as string;
  const pageId = (req.body.pageId || req.query.pageId) as string;

  if (!pageId) {
    throw new BadRequestError('pageId is required');
  }

  const reactions = await getPageData({ pageId, fingerprint });

  res.status(200).json(reactions);
});
