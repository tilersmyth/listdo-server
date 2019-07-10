import { Request } from 'express';

import { User } from '../auth/interfaces/user.interface';
import { Board } from '../board/interfaces/board.interface';

export interface ParseMember {
  address: string;
  name: string;
  user?: User;
}

export interface ParseListdo {
  boardSlug: string;
  board?: Board;
  list?: string;
  address: string;
}

export interface ParsePayload {
  initiator: ParseMember[];
  partner: ParseMember[];
  observer: ParseMember[];
  subject: string;
  html: string;
  text: string;
  listdo: ParseListdo;
  messageId: string;
  replyId?: string;
}

export interface ParseException {
  path: string;
  message: string;
}

export interface ParseInbound {
  payload: ParsePayload;
  errors: ParseException[];
  warnings: ParseException[];
}

export interface ParseRequest extends Request {
  inbound: ParseInbound;
}
