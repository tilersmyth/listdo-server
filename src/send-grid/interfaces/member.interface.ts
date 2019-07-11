import { UserProfile } from '../../auth/interfaces/user-profile.interface';

export interface ParseMember {
  address: string;
  name?: string;
  user?: UserProfile;
}
