import { Document } from 'mongoose';
import { UserProfile } from '../../auth/interfaces/user-profile.interface';

interface Body {
  text: string;
  html: string;
  preview: string;
}

interface Status {
  type: 'open' | 'closed' | 'pending';
  user: UserProfile;
  note: string;
}

export interface Email extends Document {
  board: string;
  list: string | null;
  intiator: UserProfile;
  partner: UserProfile[];
  observer: UserProfile[];
  removed: UserProfile[];
  messageId: string;
  replyId: string;
  subject: string;
  body: Body;
  status: Status;
}
