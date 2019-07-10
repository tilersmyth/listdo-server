import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';

import { UserService } from '../../auth/user.service';
import { ParseRequest, ParseMember, ParseInbound } from '../interfaces';

@Injectable()
export class AuthGuardMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  private initiatorReduce = async (
    accumulator: Promise<ParseInbound>,
    initiator: ParseMember,
    index: number,
  ) => {
    const acc = await accumulator;

    const userExists = await this.userService.findByEmail(initiator.address);

    if (!userExists) {
      acc.errors = [
        {
          path: 'inbound_parse_error',
          message: `Initiator account not found: ${initiator.address}`,
        },
        ...acc.errors,
      ];
      return acc;
    }

    acc.payload.initiator[index].user = userExists;
    return acc;
  };

  async use(req: ParseRequest, _: Response, next: NextFunction) {
    req.inbound = await req.inbound.payload.initiator.reduce(
      this.initiatorReduce,
      Promise.resolve(req.inbound),
    );

    next();
  }
}
