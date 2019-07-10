import { Document } from 'mongoose';

export interface Member {
  email: string;
  user: string;
}

export interface Board extends Document {
  name: string;
  slug: string;
  owner: string;
  members: Member[];
}
