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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
    },
    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'List',
    },
    role: {
      type: String,
      enum: ['initiator', 'partner', 'observer', 'removed'],
    },
  },
  { timestamps: true },
);
