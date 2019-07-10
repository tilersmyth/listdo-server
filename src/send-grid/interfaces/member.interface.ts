import { User } from '../../auth/interfaces/user.interface';

export interface ParseMember {
  address: string;
  name?: string;
  user?: User;
}
