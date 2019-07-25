import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { UserService } from '../user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req: Request = ctx.getContext().req;

    if (req.session && req.session.userId) {
      // Ensure user exists
      const user = await this.userService.findById(req.session.userId);

      if (!user) {
        return false;
      }

      // Attach user object
      req.session.user = user;

      return true;
    }

    return false;
  }
}
