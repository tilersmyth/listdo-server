import * as mongoose from 'mongoose';

export const ListSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    active: { type: Boolean, default: true },
    slug: String,
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);
