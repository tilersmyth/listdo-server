import * as mongoose from 'mongoose';

export const EmailSchema = new mongoose.Schema(
  {
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
    },
    list: { type: String, default: '' },
    initiator: [
      {
        email: String,
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    partner: [
      {
        email: String,
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    observer: [
      {
        email: String,
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    removed: [
      {
        email: String,
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    messageId: String,
    replyId: String,
    subject: String,
    body: {
      text: String,
      html: String,
      preview: String,
    },
    status: {
      type: {
        type: String,
        enum: ['open', 'closed', 'pending'],
        default: 'open',
      },
      user: {
        email: String,
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
      note: String,
    },
  },
  { timestamps: true },
);
