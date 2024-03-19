import mongoose, { Schema } from 'mongoose';
import { TUser } from '@/types';

const schema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: false
    },
    email: {
      type: String,
      required: true
    },
    role: {
      type: Number,
      required: true,
      default: 1
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const model = mongoose.model('User', schema);
export default model;
