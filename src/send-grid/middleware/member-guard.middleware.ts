import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface ParseRequest extends Request {
  inbound: any;
}

@Injectable()
export class MemberGuardMiddleware implements NestMiddleware {
  private isMember(group: any, listdo: any) {
    return group.reduce(
      (acc: any, user: any) => {
        const isMember = listdo.board.members.find(
          (member: any) => member.email === user.email,
        );

        if (isMember) {
          acc.auth = [user, ...acc.auth];
          return acc;
        }

        if (user.email === listdo.email) {
          return acc;
        }

        acc.notAuth = [
          {
            path: 'inbound_parse_error',
            message: `${user.email} is not authorized for '${listdo.board.name}' board`,
          },
          ...acc.notAuth,
        ];

        return acc;
      },
      { auth: [], notAuth: [] },
    );
  }

  async use(req: ParseRequest, _: Response, next: NextFunction) {
    if (req.inbound.errors.length > 0) {
      next();
      return;
    }

    const { payload } = req.inbound;

    const initiatorAuth = this.isMember(payload.initiator, payload.listdo);

    if (initiatorAuth.auth.length === 0) {
      req.inbound.errors = [
        {
          path: 'inbound_parse_error',
          message: `Initiator(s) not authorized for '${payload.listdo.board.name}' board`,
        },
      ];

      next();
      return;
    }

    if (initiatorAuth.notAuth.length > 0) {
      req.inbound.warnings = [initiatorAuth.notAuth, ...req.inbound.warnings];
    }

    // Reset initiator prop as it may have filtered out non-authorized members
    req.inbound.payload.initiator = initiatorAuth.auth;

    const partnerAuth = this.isMember(payload.partner, payload.listdo);

    if (partnerAuth.auth.length === 0) {
      req.inbound.errors = [
        {
          path: 'inbound_parse_error',
          message: `None of the recipients are authorized for '${payload.listdo.board.name}' board`,
        },
      ];

      next();
      return;
    }

    if (partnerAuth.notAuth.length > 0) {
      req.inbound.warnings = [partnerAuth.notAuth, ...req.inbound.warnings];
    }

    // Reset partner prop as it may have filtered out non-authorized members
    req.inbound.payload.initiator = partnerAuth.auth;

    next();
  }
}
