import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { UserService } from '../../auth/user.service';

interface ParseRequest extends Request {
  inbound: any;
}

@Injectable()
export class AuthGuardMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  private initiatorReduce = async (
    accumulator: any,
    initiator: any,
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

    acc.payload.initiator[index] = userExists;
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
