import { UserProfile } from '../../auth/interfaces/user-profile.interface';
import { TaskRoles } from '../../task/interfaces/task-roles.interface';

export interface EmailMember {
  user: UserProfile;
  role: TaskRoles;
}
