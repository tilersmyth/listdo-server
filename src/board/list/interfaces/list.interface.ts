import { Document } from 'mongoose';

export interface List extends Document {
  name: string;
  description: string;
  active: boolean;
  slug: string;
  board: string;
  user: string;
  lists: string[];
}
