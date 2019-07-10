import * as mongoose from 'mongoose';

export const BoardSchema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true },
);
