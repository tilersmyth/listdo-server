import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { simpleParser, ParsedMail } from 'mailparser';

import { ParseListdo, ParseRequest } from '../interfaces';
import { EmailPayload } from '../../email/interfaces';

@Injectable()
export class ParseMiddleware implements NestMiddleware {
  private static payloadKeys = [
    'messageId',
    'inReplyTo',
    'subject',
    'text',
    'textAsHtml',
    'date',
  ];

  private static envelope(rawEnvelope: string): ParseListdo {
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

  private reduceKeys = (mailparser: ParsedMail) => {
    return Object.keys(mailparser).reduce(
      (acc: EmailPayload, prop: string) => {
        return ParseMiddleware.payloadKeys.includes(prop)
          ? { [prop]: mailparser[prop], ...acc }
          : acc;
      },
      {} as EmailPayload,
    );
  };

  async use(req: ParseRequest, _: Response, next: NextFunction) {
    const { email, envelope } = req.body;

    const listdo = ParseMiddleware.envelope(envelope);
    const mailparser = await simpleParser(email);

    req.mailparser = { ...mailparser, listdo };

    const payload = this.reduceKeys(mailparser);
    payload.textPreview = mailparser.text.substring(0, 50);

    req.output = {
      email: {
        payload,
      },
      errors: [],
      warnings: [],
    };

    next();
  }
}
