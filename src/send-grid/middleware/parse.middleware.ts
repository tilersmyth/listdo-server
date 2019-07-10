import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { simpleParser, ParsedMail } from 'mailparser';

import { parseKey } from '../utils/parse-key.util';
import {
  ParseRequest,
  ParseListdo,
  ParsePayload,
  ParsePayloadRaw,
} from '../interfaces';

@Injectable()
export class ParseMiddleware implements NestMiddleware {
  private parseReduce(email: ParsedMail, acc: ParsePayload, prop: string) {
    const keyExists = parseKey.find(key => key.key === prop);

    if (keyExists) {
      const value = keyExists.parse.split('.').reduce((a, b) => a[b], email);
      acc = { [keyExists.rename ? keyExists.rename : prop]: value, ...acc };
    }

    return acc;
  }

  private parseEnvelope(rawEnvelope: string): ParseListdo {
    const envelope = JSON.parse(rawEnvelope);
    const address = envelope.to[0];
    const local = address.substr(0, address.indexOf('@'));
    const split = local.split('.');

    return {
      boardSlug: split[0],
      list: split[1],
      address,
    };
  }

  async use(req: ParseRequest, _: Response, next: NextFunction) {
    const { email, envelope } = req.body;

    const parsedEmail = await simpleParser(email);
    const payload = Object.keys(parsedEmail).reduce(
      this.parseReduce.bind(null, parsedEmail),
      {} as ParsePayloadRaw,
    );

    if (payload.from.length > 1) {
      new Logger('Initiator warning').warn(
        'Multiple initiators - assigning first one to task',
      );
    }

    payload.initiator = payload.from[0];
    delete payload.from;

    payload.listdo = this.parseEnvelope(envelope);

    req.inbound = {
      payload,
      errors: [],
      warnings: [],
    };

    next();
  }
}
