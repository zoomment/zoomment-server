import mongoose, { Schema } from 'mongoose';
import crypto from 'crypto';

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

schema.methods.insert = function (data) {
  this.secret = crypto.randomBytes(20).toString('hex');
  this.owner.email = data.owner.email;
  this.owner.name = data.owner.name;
  this.pageUrl = data.pageUrl;
  this.pageId = data.pageId;
  this.body = data.body;
  return this;
};

const model = mongoose.model('Comment', schema);
export default model;
