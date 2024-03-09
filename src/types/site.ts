import { Schema } from 'mongoose';

export type TSite = {
  userId: Schema.Types.ObjectId;
  domain: string;
  verified: boolean;
};
