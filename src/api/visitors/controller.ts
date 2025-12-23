import Visitor from './model';
import { asyncRoute } from '@/services/express';
import { BadRequestError } from '@/utils';
import { z } from 'zod';

const visitorSchema = z.object({
  pageId: z.string().min(1, 'Page ID is required')
});

export const track = asyncRoute(async (req, res) => {
  // Validate input
  const result = visitorSchema.safeParse({
    pageId: req.body.pageId || req.query.pageId
  });

  if (!result.success) {
    const errors = result.error.issues.map((e: { message: string }) => e.message);
    throw new BadRequestError(errors.join(', '));
  }

  const fingerprint: string = req.headers.fingerprint as string;
  const { pageId } = result.data;

  // Extract domain from pageId
  const url = new URL('https://' + pageId);
  const domain = url.hostname;

  if (!fingerprint) {
    throw new BadRequestError('Fingerprint required for tracking');
  }

  const searchCondition = { pageId, fingerprint, domain };

  // Try to find existing visitor, if not found create a new one
  const existingVisitor = await Visitor.findOne(searchCondition);

  if (!existingVisitor) {
    await Visitor.create(searchCondition);
  }

  // Get total unique visitors for this page
  const visitorCount = await Visitor.countDocuments({ pageId });

  res.status(200).json({
    pageId,
    count: visitorCount
  });
});

export const count = asyncRoute(async (req, res) => {
  const pageId = (req.body.pageId || req.query.pageId) as string;

  if (!pageId) {
    throw new BadRequestError('pageId is required');
  }

  // Get total unique visitors for this page
  const visitorCount = await Visitor.countDocuments({ pageId });

  res.status(200).json({
    pageId,
    count: visitorCount
  });
});

export const countByDomain = asyncRoute(async (req, res) => {
  const domain = (req.body.domain || req.query.domain) as string;

  if (!domain) {
    throw new BadRequestError('domain is required');
  }

  // Get total unique visitors for the domain
  const visitorCount = await Visitor.countDocuments({ domain });

  // Get unique pages count
  const uniquePages = await Visitor.distinct('pageId', { domain });

  res.status(200).json({
    domain,
    count: visitorCount,
    uniquePages: uniquePages.length
  });
});
