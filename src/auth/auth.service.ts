import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { UserService } from './user.service';
import { User } from './interfaces/user.interface';
import { LoginInput } from './inputs/login.input';
import { RegisterInput } from './inputs/register.input';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { AuthResponse } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  private async findUser(email: string): Promise<User> {
    return this.userService.findUserAuth(email);
  }

  public async register(input: RegisterInput): Promise<AuthResponse | null> {
    const emailInUse = await this.findUser(input.email);

    if (emailInUse) {
      return {
        path: 'email',
        message: 'email already in use',
      };
    }

    await this.userService.create(input);

    return null;
  }

  public async login(
    input: LoginInput,
    req: Request,
  ): Promise<AuthResponse | null> {
    const user = await this.findUser(input.email);

    if (!user) {
      return {
        path: 'email',
        message: 'invalid email or password',
      };
    }

    const validPassword = user.comparePassword(input.password);

    if (!validPassword) {
      return {
        path: 'email',
        message: 'invalid email or password',
      };
    }

    req.session.userId = user.id;

    return null;
  }

  async logout(ctx: ExpressContext): Promise<boolean> {
    await ctx.req.session.destroy(() => {
      return false;
    });
    await ctx.res.clearCookie('listDo');
    return true;
  }
}
