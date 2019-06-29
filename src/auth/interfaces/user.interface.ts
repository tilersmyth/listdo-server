import { Document } from 'mongoose';

export interface User extends Document {
  email: string;
  password: string;
  salt: string;
  boards: string[];
  comparePassword(password: string): boolean;
}
