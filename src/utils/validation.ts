import { z } from 'zod';

export const commentSchema = z.object({
  email: z.string().email('Invalid email address'),
  author: z.string().min(1, 'Author is required').max(100, 'Author name too long'),
  body: z.string().min(1, 'Comment body is required').max(10000, 'Comment too long'),
  pageUrl: z.string().url('Invalid page URL'),
  pageId: z.string().min(1, 'Page ID is required'),
  parentId: z.string().optional()
});

export const authSchema = z.object({
  email: z.string().email('Invalid email address')
});

export const siteSchema = z.object({
  url: z.string().url('Invalid URL')
});

export const reactionSchema = z.object({
  pageId: z.string().min(1, 'Page ID is required'),
  reaction: z.string().min(1).max(20, 'Reaction too long')
});

export type CommentInput = z.infer<typeof commentSchema>;
export type AuthInput = z.infer<typeof authSchema>;
export type SiteInput = z.infer<typeof siteSchema>;
export type ReactionInput = z.infer<typeof reactionSchema>;
