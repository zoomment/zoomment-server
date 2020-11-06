import mongoose, { Schema } from 'mongoose';

const schema = new Schema(
  {
    owner: {
      ip: {
        type: String,
        required: false,
      },
      email: {
        type: String,
        required: false,
      },
      name: {
        type: String,
        required: true,
      },
    },
    pageUrl: {
      type: String,
      required: true,
    },
    pageId: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    secret: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.model('Comment', schema);
export default model;
