import { Board } from '../../board/interfaces/board.interface';

import { EmailStatus } from './email-status.interface';
import { EmailMember } from './email-member.interface';
import { EmailPayload } from './email-payload.interface';

export interface Email {
  board: Board;
  list: string | null;
  members: EmailMember[];
  payload: EmailPayload;
  status: EmailStatus;
}
