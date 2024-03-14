import { Schema, Document } from 'mongoose';

export type TComment = Document & {
  id: string;
  _id: Schema.Types.ObjectId;
  // owner field deprecated
  owner: {
    gravatar: string;
    email: string;
    name: string;
  };
  isVerified: boolean;
  domain: string;
  gravatar: string;
  author: string;
  email: string;
  parentId: Schema.Types.ObjectId;
  pageUrl: string;
  pageId: string;
  body: string;
  secret: string;
  createdAt: Date;
};
