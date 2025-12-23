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
      required: true,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// Add indexes for better query performance
schema.index({ userId: 1 });
schema.index({ domain: 1 }, { unique: true });

const model = mongoose.model('Site', schema);
export default model;
