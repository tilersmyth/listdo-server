import { Document } from 'mongoose';
import { TaskRoles } from './task-roles.interface';

export interface Task extends Document {
  user: string;
  email: string;
  board: string;
  list: string | null;
  role: TaskRoles;
}
