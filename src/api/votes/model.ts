import mongoose, { Schema } from 'mongoose';
import { TVote } from '@/types';

const schema = new Schema<TVote>(
  {
    commentId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Comment'
    },
    fingerprint: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true,
      enum: [1, -1]
    }
  },
  {
    timestamps: true
  }
);

// Ensure one vote per user per comment
schema.index({ commentId: 1, fingerprint: 1 }, { unique: true });
schema.index({ commentId: 1 });

const model = mongoose.model('Vote', schema);

export default model;
