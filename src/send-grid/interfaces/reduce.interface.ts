import { ParseException } from './exception.interface';
import { EmailMember } from '../../email/interfaces';

export interface AuthReduce {
  auth: EmailMember[];
  noAuth: ParseException[];
}
