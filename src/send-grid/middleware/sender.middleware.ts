import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';

import { ParseRequest } from '../interfaces/request.interface';
import { ParseUtilService } from '../utils/parse-util.service';
import { EmailMember } from '../../email/interfaces';

@Injectable()
export class SenderMiddleware implements NestMiddleware {
  constructor(private readonly parseUtil: ParseUtilService) {}

  async use(
    { mailparser, output }: ParseRequest,
    _: Response,
    next: NextFunction,
  ) {
    const { value } = mailparser.from;

    const initiator = await this.parseUtil.isAuthorized(value, 'initiator');

    if (initiator.auth.length === 0) {
      output.errors = [
        {
          path: 'inbound_parse_error',
          message: 'initiator(s) not authenticated',
        },
      ];
      next();
      return;
    }

    if (initiator.noAuth.length > 0) {
      output.warnings = [...initiator.noAuth, ...output.warnings];
    }

    output.email.members = initiator.auth;

    const user = initiator.auth.map((member: EmailMember) => member.user.id);

    output.email = {
      members: initiator.auth,
      status: {
        user,
      },
      ...output.email,
    };

    next();
  }
}
