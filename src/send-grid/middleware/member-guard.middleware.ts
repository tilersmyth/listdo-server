import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';

import {
  ParseRequest,
  ParseMember,
  ParseException,
  ParseListdo,
} from '../interfaces';
import { UserService } from '../../auth/user.service';

interface MemberReduce {
  auth: ParseMember[];
  notAuth: ParseException[];
}

@Injectable()
export class MemberGuardMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  private isMember(group: ParseMember[], listdo: ParseListdo) {
    return group.reduce(
      (acc: MemberReduce, user: ParseMember) => {
        const isMember = listdo.board.members.includes(user.user.id);

        if (isMember) {
          acc.auth = [user, ...acc.auth];
          return acc;
        }

        if (user.address === listdo.address) {
          return acc;
        }

        acc.notAuth = [
          {
            path: 'inbound_parse_error',
            message: `${user.address} is not authorized for '${listdo.board.name}' board`,
          },
          ...acc.notAuth,
        ];

        return acc;
      },
      { auth: [], notAuth: [] } as MemberReduce,
    );
  }

  private async hasAccount(recipients: ParseMember[], listDo: ParseListdo) {
    return recipients.reduce(
      async (accumulator: any, recipient: ParseMember) => {
        const acc = await accumulator;

        if (recipient.address === listDo.address) {
          return acc;
        }

        const user = await this.userService.findByEmail(recipient.address);

        if (!user) {
          acc.notAuth = [
            {
              path: 'inbound_parse_error',
              message: `account not found for ${recipient.address}`,
            },
            ...acc.notAuth,
          ];
          return acc;
        }

        acc.auth = [{ address: user.email, user }, ...acc.auth];
        return acc;
      },
      Promise.resolve({ auth: [], notAuth: [] }),
    );
  }

  async use(req: ParseRequest, _: Response, next: NextFunction) {
    if (req.inbound.errors.length > 0) {
      next();
      return;
    }

    const { payload } = req.inbound;

    /*

      INITIATOR
    
    */

    if (!payload.listdo.board.members.includes(payload.initiator.user.id)) {
      req.inbound.errors = [
        {
          path: 'inbound_parse_error',
          message: `${payload.initiator.address} is not authorized for '${payload.listdo.board.name}' board`,
        },
      ];

      next();
      return;
    }

    /*

      PARTNER
    
    */

    const partner = await this.hasAccount(payload.partner, payload.listdo);

    if (partner.auth.length === 0) {
      req.inbound.errors = partner.notAuth;

      next();
      return;
    }

    if (partner.notAuth.length > 0) {
      req.inbound.warnings = [...partner.notAuth, ...req.inbound.warnings];
    }

    const partnerAuth = this.isMember(partner.auth, payload.listdo);

    if (partnerAuth.auth.length === 0) {
      req.inbound.errors = partnerAuth.notAuth;
      next();
      return;
    }

    if (partnerAuth.notAuth.length > 0) {
      req.inbound.warnings = [...partnerAuth.notAuth, ...req.inbound.warnings];
    }

    // Reset partner prop as it may have filtered out non-authorized members
    req.inbound.payload.partner = partnerAuth.auth;

    /*

      OBSERVER
    
    */

    const observer = await this.hasAccount(payload.observer, payload.listdo);

    if (observer.notAuth.length > 0) {
      req.inbound.warnings = [...observer.notAuth, ...req.inbound.warnings];

      if (observer.auth.length === 0) {
        req.inbound.payload.observer = observer.auth;
        next();
        return;
      }
    }

    const observerAuth = this.isMember(observer.auth, payload.listdo);

    if (observerAuth.notAuth.length > 0) {
      req.inbound.warnings = [...observerAuth.notAuth, ...req.inbound.warnings];
    }

    // Reset partner prop as it may have filtered out non-authorized members
    req.inbound.payload.observer = observerAuth.auth;

    next();
  }
}
