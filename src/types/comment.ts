import { Schema } from 'mongoose';

export type TComment = {
  id: string;
  _id: Schema.Types.ObjectId;
  // owner field deprecated
  owner: {
    gravatar: string;
    email: string;
    name: string;
  };
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
