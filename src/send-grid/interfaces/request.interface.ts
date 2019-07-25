import { Request } from 'express';
import { ParsedMail } from 'mailparser';

import { EmailPayload, EmailMember } from '../../email/interfaces';
import { TaskStatus } from '../../task/interfaces';
import { ParseException } from './exception.interface';
import { ParseListdo } from './listdo.interface';
import { Board } from '../../board/interfaces/board.interface';

interface EmailOutput {
  board?: Board;
  list?: string | null;
  members?: EmailMember[];
  payload?: EmailPayload;
  status?: TaskStatus;
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
