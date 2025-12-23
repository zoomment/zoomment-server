import { Schema, Document } from 'mongoose';

export type TComment = Document & {
  id: string;
  _id: Schema.Types.ObjectId;
  isVerified: boolean;
  domain: string;
  gravatar: string;
  author: string;
  email: string;
  parentId: string | null;
  pageUrl: string;
  pageId: string;
  body: string;
  secret: string;
  createdAt: Date;
  updatedAt: Date;
};
