import mongoose, { Schema } from 'mongoose';

const schema = new Schema(
  {
    owner: {
      ip: {
        type: String,
        required: false
      }
    },
    fingerprint: {
      type: String,
      required: true
    },
    pageId: {
      type: String,
      required: true
    },
    reaction: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const model = mongoose.model('Reaction', schema);

export default model;
