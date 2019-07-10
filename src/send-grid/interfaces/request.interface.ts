import { Request } from 'express';

import { ParseInbound } from './inbound.interface';

export interface ParseRequest extends Request {
  inbound: ParseInbound;
}
