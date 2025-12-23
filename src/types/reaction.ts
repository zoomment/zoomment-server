import { Document, Schema } from 'mongoose';

export type TReaction = Document & {
  id: string;
  _id: Schema.Types.ObjectId;
  fingerprint: string;
  domain: string;
  pageId: string;
  reaction: string;
  createdAt: Date;
  updatedAt: Date;
};
