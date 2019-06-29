import { Document } from 'mongoose';

export interface Board extends Document {
  name: string;
  owner: string;
  members: string[];
}
