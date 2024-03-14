import mongoose, { Schema } from 'mongoose';
import { TComment } from '@/types';

const schema = new Schema<TComment>(
  {
    // owner field deprecated
    owner: {
      ip: {
        type: String,
        required: false
      },
      gravatar: {
        type: String,
        required: false
      },
      email: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      }
    },
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

const model = mongoose.model('Comment', schema);
export default model;
