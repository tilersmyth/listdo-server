import { Document } from 'mongoose';

export interface Task extends Document {
  user: string;
  email: string;
  board: string;
  list: string | null;
  role: 'initiator' | 'partner' | 'observer' | 'removed';
}
