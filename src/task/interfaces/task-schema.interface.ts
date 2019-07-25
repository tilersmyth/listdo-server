import { Document } from 'mongoose';
import { TaskRoles } from './task-roles.interface';
import { TaskStatus } from './task-status.interface';
import { EmailSchema } from '../../email/interfaces';

export interface TaskSchema extends Document {
  user: string;
  email: string | EmailSchema;
  board: {
    id: string;
    order: number;
  };
  list: {
    id: string;
    order: number;
  };
  role: TaskRoles;
  status: TaskStatus;
}
