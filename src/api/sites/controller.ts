import { fetchSiteToken } from '@/services/metadata';
import { asyncRoute } from '@/services/express';
import Site from './model';

export const add = asyncRoute(async (req, res) => {
  const websiteUrl = new URL(req.body.url);
  const domain = websiteUrl.hostname;
  const token = await fetchSiteToken(websiteUrl.href);

  if (token !== req.user.id) {
    res.status(404).json({ message: 'Meta tag not found' });
    return;
  }

  const exists = await Site.findOne({ domain });

  if (exists) {
    res.status(401).json({ message: 'Website already exists' });
    return;
  }

  const site = await Site.create({
    verified: true,
    userId: req.user.id,
    domain: websiteUrl.hostname
  });

  res.json(site);
});

export const list = asyncRoute(async (req, res) => {
  const sites = await Site.find({ userId: req.user.id }).sort({ _id: 'desc' });

  res.json(sites);
});

export const remove = asyncRoute(async (req, res) => {
  const { deletedCount } = await Site.deleteOne({
    userId: req.user.id,
    _id: req.params.id
  });

  if (deletedCount > 0) {
    res.status(200).json({ _id: req.params.id });
  } else {
    res.status(404).json({ message: 'Site not found' });
  }
});
