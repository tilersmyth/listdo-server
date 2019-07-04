import { UserProfile } from '../../auth/interfaces/user-profile.interface';

interface Payload {
  messageId: string;
  replyId: string;
  from: UserProfile;
  to: UserProfile[];
  cc: UserProfile[];
  subject: string;
  bodyText: string | null;
  bodyHtml: string | null;
}

export interface CreateDemo {
  board: string;
  list: string | null;
  payload: Payload;
}
