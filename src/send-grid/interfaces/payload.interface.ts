import { ParseMember } from './member.interface';
import { ParseListdo } from './listdo.interface';

export interface ParsePayload {
  initiator: ParseMember;
  partner: ParseMember[];
  observer: ParseMember[];
  subject: string;
  html: string;
  text: string;
  listdo: ParseListdo;
  messageId: string;
  replyId?: string;
}

export interface ParsePayloadRaw extends ParsePayload {
  from: ParseMember[];
}
