import mongoose, { Schema } from 'mongoose';
import { TVisitor } from '@/types';

const schema = new Schema<TVisitor>(
  {
    fingerprint: {
      type: String,
      required: true
    },
    domain: {
      type: String,
      required: true
    },
    pageId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Add indexes for better query performance
schema.index({ pageId: 1, fingerprint: 1 }, { unique: true });
schema.index({ domain: 1 });
schema.index({ pageId: 1 });

const model = mongoose.model('Visitor', schema);

export default model;
