import Reaction from './model';
import { getPageData } from './helper';

import { asyncRoute } from '../../services/express';
const VIEW = 'view';

export const reactOrView = asyncRoute(async (req, res) => {
  const fingerprint = req.headers.fingerprint;
  const pageId = req.body.pageId || req.query.pageId;
  const reaction = (req.body.reaction || VIEW).slice(0, 20); // Just in case, limit characters by 20 

  if (!fingerprint) {
    return res.status(500).send('Fingerprint required for reacting.');
  }

  const searchCondition = { pageId, fingerprint };
  const recordInDB = await Reaction.findOne(searchCondition);

  const newReaction = recordInDB && recordInDB.reaction === reaction ? VIEW : reaction;
  if (recordInDB && reaction !== VIEW) {
    recordInDB.reaction = newReaction;
    await recordInDB.save();
  }

  if (!recordInDB) {
    await new Reaction({ ...searchCondition, reaction }).save();
  }

  const reactions = await getPageData(searchCondition);

  return res.status(200).json(reactions);
});
