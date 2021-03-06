import { Document } from 'mongoose';

export interface Board extends Document {
  name: string;
  slug: string;
  owner: string;
  members: string[];
}
