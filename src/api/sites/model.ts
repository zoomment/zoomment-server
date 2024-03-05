import mongoose, { Schema } from 'mongoose';
import { TSite } from '@/types';

const schema = new Schema<TSite>(
  {
    domain: {
      type: String,
      required: true
    },
    verified: {
      type: Boolean,
      default: false
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const model = mongoose.model('Site', schema);
export default model;
