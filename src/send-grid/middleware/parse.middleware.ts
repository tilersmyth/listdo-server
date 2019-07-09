import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { simpleParser } from 'mailparser';

import { parseKey } from '../utils/parse-key.util';

interface ParseRequest extends Request {
  inbound: any;
}

@Injectable()
export class ParseMiddleware implements NestMiddleware {
  private parseReduce(email: any, acc: any, prop: string) {
    const keyExists = parseKey.find(key => key.key === prop);

    if (keyExists) {
      const value = keyExists.parse.split('.').reduce((a, b) => a[b], email);
      acc = { [keyExists.rename ? keyExists.rename : prop]: value, ...acc };
    }

    return acc;
  }

  private parseEnvelope(rawEnvelope: string) {
    const envelope = JSON.parse(rawEnvelope);
    const address = envelope.to[0];
    const local = address.substr(0, address.indexOf('@'));
    const split = local.split('.');

    return {
      board: split[0],
      list: split[1],
      address,
    };
  }

  async use(req: ParseRequest, _: Response, next: NextFunction) {
    const { email, envelope } = req.body;

    const parsedEmail = await simpleParser(email);
    const payload: any = Object.keys(parsedEmail).reduce(
      this.parseReduce.bind(null, parsedEmail),
      {},
    );

    payload.listdo = this.parseEnvelope(envelope);

    req.inbound = {
      payload,
      errors: [],
      warnings: [],
    };

    next();
  }
}
