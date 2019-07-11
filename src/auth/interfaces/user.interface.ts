import { Document } from 'mongoose';

export interface User extends Document {
  id: string;
  email: string;
  boards: string[];
  password: string;
  salt: string;
  comparePassword(password: string): boolean;
}
