import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';

import { UserService } from '../../auth/user.service';
import { ParseRequest } from '../interfaces';

@Injectable()
export class AuthGuardMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: ParseRequest, _: Response, next: NextFunction) {
    const initiator = req.inbound.payload.initiator;

    const user = await this.userService.findByEmail(initiator.address);

    if (!user) {
      req.inbound.errors = [
        {
          path: 'inbound_parse_error',
          message: `Initiator account not found: ${initiator.address}`,
        },
      ];
      next();
      return;
    }

    req.inbound.payload.initiator.user = user;

    next();
  }
}
