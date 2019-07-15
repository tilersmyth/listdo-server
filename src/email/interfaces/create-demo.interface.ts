import { EmailPayload } from './email-payload.interface';
import { EmailMember } from './email-member.interface';

export interface CreateDemo {
  board: string;
  list: string | null;
  payload: EmailPayload;
  members: EmailMember[];
}
