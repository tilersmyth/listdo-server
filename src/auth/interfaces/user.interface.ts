import { Document } from 'mongoose';

export interface User extends Document {
  email: string;
  password: string;
  salt: string;
  comparePassword(password: string): boolean;
}
