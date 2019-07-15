import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';

import { ParseRequest } from '../interfaces/request.interface';
import { ParseUtilService } from '../utils/parse-util.service';

@Injectable()
export class MemberMiddleware implements NestMiddleware {
  constructor(private readonly parseUtil: ParseUtilService) {}

  async use(
    { mailparser, output }: ParseRequest,
    _: Response,
    next: NextFunction,
  ) {
    if (output.errors.length > 0) {
      next();
      return;
    }

    const { email } = output;

    /*
      START INITIATOR (FROM)
    */

    const initiator = this.parseUtil.isAuthenticated(
      email.members,
      email.board,
    );

    if (initiator.auth.length === 0) {
      output.errors = [
        {
          path: 'inbound_parse_error',
          message: `initiator(s) not authorized for '${email.board.name}' board`,
        },
      ];
      next();
      return;
    }

    if (initiator.noAuth.length > 0) {
      output.warnings = [...initiator.noAuth, ...output.warnings];
    }

    output.email.members = initiator.auth;

    /*
     END INITIATOR (FROM)
    */

    /*
      START PARTNER (TO)
    */

    const { to } = mailparser;

    if (to) {
      const partner = await this.parseUtil.isAuthorized(to.value, 'partner');

      if (partner.auth.length === 0) {
        output.errors = [
          {
            path: 'inbound_parse_error',
            message: 'None of the partners have accounts',
          },
        ];
        next();
        return;
      }

      if (partner.noAuth.length > 0) {
        output.warnings = [...partner.noAuth, ...output.warnings];
      }

      const partnerMember = await this.parseUtil.isAuthenticated(
        partner.auth,
        email.board,
      );

      if (partnerMember.auth.length === 0) {
        output.errors = [
          {
            path: 'inbound_parse_error',
            message: `None of the partners are authorized for '${email.board.name}' board`,
          },
        ];
        next();
        return;
      }

      if (partnerMember.noAuth.length > 0) {
        output.warnings = [...partnerMember.noAuth, ...output.warnings];
      }

      output.email.members = [...partnerMember.auth, ...output.email.members];
    }

    /*
      END PARTNER (TO)
    */

    /*
      START OBSERVER (CC)
    */

    const { cc } = mailparser;

    if (cc) {
      const observer = await this.parseUtil.isAuthorized(cc.value, 'observer');

      if (observer.noAuth.length > 0) {
        output.warnings = [...observer.noAuth, ...output.warnings];
      }

      const observerMember = await this.parseUtil.isAuthenticated(
        observer.auth,
        email.board,
      );

      if (observerMember.noAuth.length > 0) {
        output.warnings = [...observerMember.noAuth, ...output.warnings];
      }

      output.email.members = [...observerMember.auth, ...output.email.members];
    }

    /*
     END OBSERVER (CC)
   */

    next();
  }
}
