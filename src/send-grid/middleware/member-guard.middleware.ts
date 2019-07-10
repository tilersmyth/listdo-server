import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';

import {
  ParseRequest,
  ParseMember,
  ParseException,
  ParseListdo,
} from '../types';
import { Member } from '../../board/interfaces/board.interface';

interface MemberReduce {
  auth: ParseMember[];
  notAuth: ParseException[];
}

@Injectable()
export class MemberGuardMiddleware implements NestMiddleware {
  private isMember(group: ParseMember[], listdo: ParseListdo) {
    return group.reduce(
      (acc: MemberReduce, user: ParseMember) => {
        const isMember = listdo.board.members.find(
          (member: Member) => member.email === user.address,
        );

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

  async use(req: ParseRequest, _: Response, next: NextFunction) {
    if (req.inbound.errors.length > 0) {
      next();
      return;
    }

    const { payload } = req.inbound;

    /*

      INITIATOR
    
    */

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
      req.inbound.warnings = [
        ...initiatorAuth.notAuth,
        ...req.inbound.warnings,
      ];
    }

    // Reset initiator prop as it may have filtered out non-authorized members
    req.inbound.payload.initiator = initiatorAuth.auth;

    /*

      PARTNER
    
    */

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
      req.inbound.warnings = [...partnerAuth.notAuth, ...req.inbound.warnings];
    }

    // Reset partner prop as it may have filtered out non-authorized members
    req.inbound.payload.partner = partnerAuth.auth;

    /*

      OBSERVER
    
    */

    const observerAuth = this.isMember(payload.observer, payload.listdo);

    if (observerAuth.notAuth.length > 0) {
      req.inbound.warnings = [...observerAuth.notAuth, ...req.inbound.warnings];
    }

    // Reset partner prop as it may have filtered out non-authorized members
    req.inbound.payload.observer = observerAuth.auth;

    next();
  }
}
