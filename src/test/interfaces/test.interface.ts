import { Document } from 'mongoose';

export interface Test extends Document {
  readonly name: string;
  readonly count: number;
}
