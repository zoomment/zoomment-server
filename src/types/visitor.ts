import { Document, Schema } from 'mongoose';

export type TVisitor = Document & {
  id: string;
  _id: Schema.Types.ObjectId;
  fingerprint: string;
  domain: string;
  pageId: string;
  createdAt: Date;
  updatedAt: Date;
};
