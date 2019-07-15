import * as mongoose from 'mongoose';

export const EmailSchema = new mongoose.Schema(
  {
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
    },
    list: { type: String, default: '' },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        role: {
          type: String,
          enum: ['initiator', 'partner', 'observer', 'removed'],
        },
      },
    ],
    payload: {
      messageId: String,
      inReplyTo: String,
      subject: String,
      text: String,
      textAsHtml: String,
      textPreview: String,
      date: Date,
    },
    status: {
      type: {
        type: String,
        enum: ['open', 'closed', 'pending'],
        default: 'open',
      },
      user: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      note: String,
    },
  },
  { timestamps: true },
);
