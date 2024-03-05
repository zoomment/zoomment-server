import { fetchSiteToken } from '@/services/metadata';
import { asyncRoute } from '@/services/express';
import Site from './model';

export const add = asyncRoute(async (req, res) => {
  const websiteUrl = new URL(req.body.url);
  const domain = websiteUrl.hostname;
  const token = await fetchSiteToken(websiteUrl.href);

  if (token !== req.user.id) {
    res.json({ message: 'Invalid token' }).status(401);
    return;
  }

  const exists = await Site.findOne({ domain });

  if (exists) {
    res.json({ message: 'Website already exists' }).status(401);
    return;
  }

  const site = await Site.create({
    verified: true,
    userId: req.user.id,
    domain: websiteUrl.hostname
  });

  res.status(200).json(site);
});
