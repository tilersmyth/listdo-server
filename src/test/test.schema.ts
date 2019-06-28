import * as mongoose from 'mongoose';

export const TestSchema = new mongoose.Schema({
  name: String,
  count: Number,
});
