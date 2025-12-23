import { Document, Schema } from 'mongoose';

export type TUser = Document & {
  id: string;
  _id: Schema.Types.ObjectId;
  name: string;
  email: string;
  role: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};
