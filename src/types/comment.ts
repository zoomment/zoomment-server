import mongoose, { Schema } from 'mongoose';

export type TComment = {
  id: string;
  _id: Schema.Types.ObjectId;
  owner: {
    ip: string;
    gravatar: string;
    email: string;
    name: string;
  };
  siteId: Schema.Types.ObjectId;
  pageUrl: string;
  pageId: string;
  body: string;
  secret: string;
  createdAt: Date;
};
