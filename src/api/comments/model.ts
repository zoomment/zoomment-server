import mongoose, { Schema } from 'mongoose';
import { TComment } from '@/types';

const schema = new Schema<TComment>(
  {
    parentId: {
      type: String,
      required: false,
      ref: 'Comment'
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    gravatar: {
      type: String,
      required: false
    },
    domain: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    pageUrl: {
      type: String,
      required: true
    },
    pageId: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    secret: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Add indexes for better query performance
schema.index({ pageId: 1, parentId: 1 });
schema.index({ domain: 1, createdAt: -1 });
schema.index({ email: 1 });

const model = mongoose.model('Comment', schema);
export default model;
