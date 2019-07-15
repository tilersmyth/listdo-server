import { Request } from 'express';
import { ParsedMail } from 'mailparser';

import { EmailPayload, EmailMember, EmailStatus } from '../../email/interfaces';
import { ParseException } from './exception.interface';
import { ParseListdo } from './listdo.interface';
import { Board } from '../../board/interfaces/board.interface';

interface EmailOutput {
  board?: Board;
  list?: string | null;
  members?: EmailMember[];
  payload?: EmailPayload;
  status?: EmailStatus;
}

interface ParsedOutput {
  email: EmailOutput;
  errors: ParseException[];
  warnings: ParseException[];
}

interface CustomParsedMail extends ParsedMail {
  listdo: ParseListdo;
}

export interface ParseRequest extends Request {
  mailparser: CustomParsedMail;
  output: ParsedOutput;
}
