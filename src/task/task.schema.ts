import * as mongoose from 'mongoose';

export const TaskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    email: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Email',
    },
    board: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
      },
      order: {
        type: Number,
        default: 0,
      },
    },
    list: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
      },
      order: {
        type: Number,
        default: 0,
      },
    },
    role: {
      type: String,
      enum: ['initiator', 'partner', 'observer', 'removed'],
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
      message: String,
    },
  },
  { timestamps: true },
);
