import { fetchSiteToken } from '@/services/metadata';
import { asyncRoute } from '@/services/express';
import Site from './model';
import { siteSchema, BadRequestError, NotFoundError, UnauthorizedError } from '@/utils';

export const add = asyncRoute(async (req, res) => {
  // Validate input
  const result = siteSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map((e: { message: string }) => e.message);
    throw new BadRequestError(errors.join(', '));
  }

  if (!req.user) {
    throw new UnauthorizedError();
  }

  const websiteUrl = new URL(result.data.url);
  const domain = websiteUrl.hostname;
  const token = await fetchSiteToken(websiteUrl.href);

  if (token !== req.user.id) {
    throw new NotFoundError('Meta tag not found');
  }

  const exists = await Site.findOne({ domain });

  if (exists) {
    throw new UnauthorizedError('Website already exists');
  }

  const site = await Site.create({
    verified: true,
    userId: req.user.id,
    domain: websiteUrl.hostname
  });

  res.json(site);
});

export const list = asyncRoute(async (req, res) => {
  if (!req.user) {
    throw new UnauthorizedError();
  }

  const sites = await Site.find({ userId: req.user.id }).sort({ _id: 'desc' });

  res.json(sites);
});

export const remove = asyncRoute(async (req, res) => {
  if (!req.user) {
    throw new UnauthorizedError();
  }

  const { deletedCount } = await Site.deleteOne({
    userId: req.user.id,
    _id: req.params.id
  });

  if (deletedCount > 0) {
    res.status(200).json({ _id: req.params.id });
  } else {
    throw new NotFoundError('Site not found');
  }
});
