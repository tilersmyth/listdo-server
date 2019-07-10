import { ParsePayload } from './payload.interface';
import { ParseException } from './exception.interface';

export interface ParseInbound {
  payload: ParsePayload;
  errors: ParseException[];
  warnings: ParseException[];
}
