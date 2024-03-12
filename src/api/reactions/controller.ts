import Reaction from './model';
import { getPageData } from './helper';
import { asyncRoute } from '@/services/express';

export const add = asyncRoute(async (req, res) => {
  // TODO add validation
  const fingerprint: string = req.headers.fingerprint as string;
  const pageId = req.body.pageId || req.query.pageId;
  const reaction = req.body.reaction.slice(0, 20); // Just in case, limit characters by 20

  // TODO remove after migration
  const url = new URL('https://' + pageId);

  if (!fingerprint) {
    return res.status(500).send('Fingerprint required for reacting.');
  }

  const searchCondition = { pageId, fingerprint, domain: url.hostname };
  const recordInDB = await Reaction.findOne(searchCondition);

  if (!recordInDB) {
    await Reaction.create({ ...searchCondition, reaction });
  } else {
    if (recordInDB.reaction === reaction) {
      await Reaction.deleteOne({ _id: recordInDB.id });
    } else {
      recordInDB.reaction = reaction;
      await recordInDB.save();
    }
  }

  const reactions = await getPageData(searchCondition);

  return res.status(200).json(reactions);
});

export const list = asyncRoute(async (req, res) => {
  // TODO add validation
  const fingerprint: string = req.headers.fingerprint as string;
  const pageId = req.body.pageId || req.query.pageId;

  const reactions = await getPageData({ pageId, fingerprint });

  return res.status(200).json(reactions);
});
