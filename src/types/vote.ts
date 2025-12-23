import { Document, Schema } from 'mongoose';

export type TVote = Document & {
  id: string;
  _id: Schema.Types.ObjectId;
  commentId: Schema.Types.ObjectId;
  fingerprint: string;
  value: 1 | -1; // 1 = upvote, -1 = downvote
  createdAt: Date;
  updatedAt: Date;
};
